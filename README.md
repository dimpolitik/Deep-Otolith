# DeepOtolith

Age-reading of fish otoliths or scales is important to estimate demographic and population dynamics parameters of fish stocks and is key information in achieving sustainable exploitation of fisheries resources. However, extracting age information from otolith images is labor-intensive and highly dependent on experienced readers. This suggests a need for cost-effective approaches which could facilitate a more streaming analysis. Here, we present DeepOtolith, an automatic web-based system for estimating fish age combining otolith images with deep learning. 

DeepOtolith is easy to use, receiving as input otolith images from a specific fish species and returning fish age. DeepOtolith is based on convolutional neural networks (CNNs), a class of deep neural networks efficient for analysing images to resolve computer vision tasks. In our case, CNNs are trained on otolith images for a specific fish species and then used to make age predictions. DeepOtolith currently contains four species, but other species can be included, as related works are being published in the future, since the platform is scalable. DeepOtolith welcomes collaborations with researchers who want to contribute towards the automation of fish ageing. It is accessible at the following URL address: http://otoliths.ath.hcmr.gr/.

This AI platform was the result of collaboration of: Hellenic Center for Marine Reserach (HCMR), Norwegian Computing Center (NR) and Institute of Marine Research (IMR) in Bergen, Norway. 

<p align="center">
<img src = "https://github.com/dimpolitik/Deep-Otolith/blob/main/SearchPage.PNG" width="60%" height="60%" />
<figcaption>Search page of DeepOtolith.</figcaption>
</p>

## Tested fish species

* Red mullet (*Mullus barbatus*)
* Greenland halibut (*Reinhardtius hippoglossoides*)
* Atlantic salmon (*Salmo salar L. 1758*)

<p align="center">
<img src = "https://github.com/dimpolitik/Deep-Otolith/blob/main/otoliths.png" width="60%" height="60%" />
</p>

## References

* Ordoñes A. et al. 2020. Explaining decision of deep neural networks used for fish age prediction. PLoS ONE 15(6), e0235013.
* Politikos D. et al. 2021. Automating fish age estimation combining otolith images and deep learning: the role of multitask learning. Fisheries Science 242, 106033.
* Vabø R. et al. 2020. Automatic interpretation of salmon scales using deep learning. Ecological Informatics 63, 101322.
