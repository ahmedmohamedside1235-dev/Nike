@echo off
powershell -Command "
Add-Type -AssemblyName System.Drawing;

$targetWidth = 743
$targetHeight = 283

Get-ChildItem -Path . -Include *.jpg,*.jpeg,*.png -File | ForEach-Object {

    $img = [System.Drawing.Image]::FromFile($_.FullName)

    $ratioOriginal = $img.Width / $img.Height
    $ratioTarget = $targetWidth / $targetHeight

    if ($ratioOriginal -gt $ratioTarget) {
        # الصورة أعرض → نقص من العرض
        $newWidth = [int]($img.Height * $ratioTarget)
        $newHeight = $img.Height
        $x = [int](($img.Width - $newWidth) / 2)
        $y = 0
    } else {
        # الصورة أطول → نقص من الطول
        $newWidth = $img.Width
        $newHeight = [int]($img.Width / $ratioTarget)
        $x = 0
        $y = [int](($img.Height - $newHeight) / 2)
    }

    $cropRect = New-Object System.Drawing.Rectangle $x, $y, $newWidth, $newHeight
    $bmpCrop = New-Object System.Drawing.Bitmap $cropRect.Width, $cropRect.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bmpCrop)
    $graphics.DrawImage($img, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)

    $finalBmp = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
    $graphics2 = [System.Drawing.Graphics]::FromImage($finalBmp)
    $graphics2.DrawImage($bmpCrop, 0, 0, $targetWidth, $targetHeight)

    $newName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name) + '_resized' + $_.Extension
    $finalBmp.Save((Join-Path $_.DirectoryName $newName), $img.RawFormat)

    $graphics.Dispose()
    $graphics2.Dispose()
    $img.Dispose()
    $bmpCrop.Dispose()
    $finalBmp.Dispose()

    Write-Host \"تم تعديل $($_.Name)\"
}
"
pause