# Convert Downloaded JSON to excel file
# Libraries
library(jsonlite, lib.loc="C:/Rpackages")
library(xlsx, lib.loc="C:/Rpackages")

Json2xls <- function(json_file, xls_file){
  # Converts downloaded JSON to an excel file
  # Returns:
  # Image-name 
  # Probabilities for each Age-class
  # Age prediction for higher probability
  conn <- file(json_file,open="r")
  lines <-readLines(conn, warn = FALSE)
  dummy_file <- "output.txt"
  close( file(dummy_file, open="w" ) )
  for (i in 1:length(lines)){
   if (i==1){
      lines[i] <- paste0('{', lines[i])   
      write(lines[i], file = dummy_file, append=TRUE)
    }else if (i==length(lines)){
      lines[i] <- gsub(',', '}', lines[i])   
      write(lines[i], file = dummy_file, append=TRUE)
    }else{
      write(lines[i], file = dummy_file, append=TRUE)
   }}  
  close(conn)

  js <- jsonlite::fromJSON(dummy_file)
  df <- data.frame()
  for (i in seq(length(js))){
   d <- c(names(js)[i], as.numeric(round(js[[i]]$y,2)), as.numeric(which.max(round(js[[i]]$y,2))-1))
   df <- rbind(df,d)
  }
  names(df) <- c('Image', paste0('Age-', js[[1]]$x), 'Age Prediction (due to higher probability)')
  df[-1] <- lapply(df[-1],as.numeric)
  View(df)
  write.xlsx(df, xls_file, row.names = FALSE, col.names = TRUE)
}

# --- Change filenames and Run -------------
  
# Load downloaded JSON
load_dowloaded_file <- 'MyFile.txt'  

# Define output filename
excel_file <- 'fish_age.xlsx'  
  
Json2xls(load_dowloaded_file, excel_file)
