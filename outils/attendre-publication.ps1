# Attend la fin de la publication GitHub Pages pour un commit donné, puis ouvre le site.
# Utilise l'API publique de GitHub (aucune connexion nécessaire, dépôt public).
param(
  [Parameter(Mandatory = $true)][string]$Commit,
  [string]$Depot = 'edgarm44/Fragx',
  [string]$Site = 'https://edgarm44.github.io/Fragx/',
  [int]$MaxSecondes = 360,
  [string]$Api = 'https://api.github.com',
  [int]$Pause = 4,
  # En arrière-plan : aucune fenêtre, message seulement en cas de problème
  [switch]$Discret
)
$ErrorActionPreference = 'Stop'
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch { }
$url = "$Api/repos/$Depot/actions/runs?head_sha=$Commit&per_page=5"
$entetes = @{ 'User-Agent' = 'Fragx-publier'; 'Accept' = 'application/vnd.github+json' }
$debut = Get-Date

function Alerter([string]$texte) {
  if (-not $Discret) { return }
  try {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($texte, 'Fragx - publication') | Out-Null
  } catch { }
}
$dernierEtat = ''

while (((Get-Date) - $debut).TotalSeconds -lt $MaxSecondes) {
  try {
    $reponse = Invoke-RestMethod -Uri $url -Headers $entetes -TimeoutSec 15
    $run = $reponse.workflow_runs | Where-Object { $_.name -eq 'Publication GitHub Pages' } | Select-Object -First 1
  } catch {
    $run = $null
  }

  if ($run) {
    $etat = switch ($run.status) { 'queued' { 'en attente' } 'in_progress' { 'construction en cours' } 'completed' { 'termine' } default { $run.status } }
    if ($etat -ne $dernierEtat) { Write-Host "      Publication : $etat"; $dernierEtat = $etat }
    if ($run.status -eq 'completed') {
      if ($run.conclusion -eq 'success') {
        Write-Host ''
        Write-Host "[OK] Site mis a jour : $Site"
        try { Start-Process $Site } catch { Write-Host "         Ouvre cette adresse dans ton navigateur." }
        exit 0
      }
      Write-Host ''
      Write-Host "[ERREUR] La construction du site a echoue sur GitHub. L'ancienne version reste en ligne."
      Alerter "La mise en ligne a echoue sur GitHub. L'ancienne version du site reste en ligne. Dis a Claude : la publication a echoue."
      Write-Host "         Dis a Claude : la publication a echoue (commit $($Commit.Substring(0, [Math]::Min(7, $Commit.Length))))."
      exit 2
    }
  } elseif (-not $dernierEtat) {
    Write-Host '      Publication : demarrage...'
    $dernierEtat = 'demarrage'
  }
  Start-Sleep -Seconds $Pause
}

Write-Host ''
Write-Host "[INFO] La publication prend plus de temps que prevu. Le site sera a jour dans quelques minutes : $Site"
Alerter "La mise en ligne prend plus de temps que prevu. Le site sera a jour dans quelques minutes."
exit 1
