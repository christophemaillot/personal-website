---
title: Raspberry Pi tips and hints
lang: en
publish: false
tags: blog
lastupdate: 2020-03-03
permalink: /blog/{{title | slug}}/index.html
layout: blog.njk
--- 

Ci-dessous la description (rapide) des instructions pour l'installation d'une Raspbian sur une carte SD sous MacOS.

Télécharger une raspbian depuis http://www.raspberrypi.org/downloads/ (privilégier le téléchargement par bittorrent)

Insérer une carte SD dans le lecteur du Mac.

Lister les disques disponibles avec la commande 
diskutil list
Repérer le disque correspondant à la caret SD. La première entrée est probablement le disque dur du mac, la deuxième probablement la carte SD. Dans la suite, on suppose que la carte SD est /dev/disk1

Démonter la carte SD avec :
diskutil unmountDisk /dev/disk1

Ecrire l'image de la raspbian sur la carte SD avec la commande suivante, à adapter :
dd if=./2018-11-13-raspbian-stretc of=/dev/rdisk3 bs=32m
Notez l'utilisation de /dev/rdisk1 et pas /dev/disk1, qui accélère l'écriture. Adapter le paramètre bsize. La valeur 32M semble être la meilleur sur mon poste et ma carte SD ; ce paramètre influe directement la vitesse d'écriture sur la carte SD. 
L'étape d'écriture est particulièrement longue. Pendant cette étape, vous pouvez faire ctrl-t dans le terminal pour que dd affiche son évolution.

