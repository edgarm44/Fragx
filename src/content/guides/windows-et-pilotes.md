---
titre: Préparer Windows et les pilotes pour jouer
description: Les réglages système à vérifier une fois pour toutes avant de toucher aux paramètres des jeux.
jeu: Tous les jeux
misAJour: 2026-10-25
---

Avant d'ajuster les options graphiques d'un jeu, vérifie que Windows et les pilotes ne brident pas ton PC. Ces réglages se font une seule fois et profitent à tous tes jeux.

## Vérifier la fréquence de l'écran

C'est l'oubli le plus courant : un écran 144 Hz ou 240 Hz reste souvent réglé à 60 Hz après l'installation de Windows ou d'un pilote.

Dans **Paramètres > Système > Affichage > Affichage avancé**, choisis la fréquence la plus élevée dans « Choisir une fréquence d'actualisation ». Si elle n'apparaît pas, vérifie le câble : sur beaucoup d'écrans, seules les prises DisplayPort ou HDMI 2.0 et plus récentes permettent les hautes fréquences. Branche aussi l'écran sur la carte graphique, pas sur la carte mère.

Le [diagnostic du setup](/setup) mesure la fréquence réellement utilisée par ton navigateur, pratique pour contrôler.

## Mettre à jour le pilote graphique

Télécharge le pilote depuis le site du fabricant de ta carte (NVIDIA, AMD ou Intel) plutôt que via Windows Update, qui installe souvent une version plus ancienne. Les pilotes récents corrigent régulièrement des problèmes de performance sur les jeux récents.

## Désactiver la précision du pointeur

Dans **Paramètres > Bluetooth et appareils > Souris > Paramètres de souris supplémentaires > Options du pointeur**, décoche « Améliorer la précision du pointeur ». Cette option accélère le curseur selon la vitesse du geste, ce qui rend la visée moins prévisible dans les jeux qui ne lisent pas directement la souris.

## Activer le mode Jeu

Dans **Paramètres > Jeux > Mode Jeu**, laisse l'option activée : Windows limite alors les mises à jour et tâches de fond pendant que tu joues.

## Choisir la bonne carte graphique

Sur un PC portable ou un PC avec processeur graphique intégré, ouvre **Paramètres > Système > Affichage > Graphiques** et règle tes jeux sur « Hautes performances » pour forcer la carte dédiée.

## Réduire la latence en jeu

Si le jeu le propose, active **NVIDIA Reflex** (cartes NVIDIA) ou **AMD Anti-Lag** (cartes AMD). Ces options réduisent le délai entre ton clic et l'affichage, surtout quand la carte graphique est très sollicitée.

## Fermer ce qui tourne en arrière-plan

Les superpositions (overlays) de Discord, Steam ou des logiciels de capture, ainsi que les navigateurs avec beaucoup d'onglets, consomment des ressources. Ferme ce qui ne sert pas pendant tes parties, surtout si ton PC est juste en performances.
