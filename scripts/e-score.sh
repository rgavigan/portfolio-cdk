#!/bin/bash

# Clone Git Repository for e-score
git clone https://github.com/rgavigan/e-score.git

# Install pip dependencies
!pip install blosum
!pip install Bio
!pip3 install torch torchvision torchaudio transformers sentencepiece accelerate --extra-index-url https://download.pytorch.org/whl/cu116
!pip install protein-bert
!pip install biopython biotite
!pip3 install torch torchvision torchaudio transformers sentencepiece accelerate --extra-index-url https://download.pytorch.org/whl/cu116
!pip install fair-esm