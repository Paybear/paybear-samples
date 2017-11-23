<?php
include "rate.php";

function getCurrency($code, $address, $req) {
  $rate = getRate($code);
  if ($rate) {
      $coinsValue = round($req->fiatValue / $rate, 5);

      switch ($code) {
          case 'ETH':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => "Ethereum",
                  'code' => "ETH",
                  'metamask' => true,
                  'confirmations' => 0,
                  'icon' => 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQxNyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHZpZXdCb3g9IjAgMCAyNTYgNDE3IiB3aWR0aD0iMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xMjcuOTYxMSAwLTIuNzk1IDkuNXYyNzUuNjY4bDIuNzk1IDIuNzkgMTI3Ljk2Mi03NS42Mzh6IiBmaWxsPSIjMzQzNDM0Ii8+PHBhdGggZD0ibTEyNy45NjIgMC0xMjcuOTYyIDIxMi4zMiAxMjcuOTYyIDc1LjYzOXYtMTMzLjgwMXoiIGZpbGw9IiM4YzhjOGMiLz48cGF0aCBkPSJtMTI3Ljk2MTEgMzEyLjE4NjYtMS41NzUgMS45MnY5OC4xOTlsMS41NzUgNC42MDEgMTI4LjAzOC0xODAuMzJ6IiBmaWxsPSIjM2MzYzNiIi8+PHBhdGggZD0ibTEyNy45NjIgNDE2LjkwNTJ2LTEwNC43MmwtMTI3Ljk2Mi03NS42eiIgZmlsbD0iIzhjOGM4YyIvPjxwYXRoIGQ9Im0xMjcuOTYxMSAyODcuOTU3NyAxMjcuOTYtNzUuNjM3LTEyNy45Ni01OC4xNjJ6IiBmaWxsPSIjMTQxNDE0Ii8+PHBhdGggZD0ibSAuMDAwOSAyMTIuMzIwOCAxMjcuOTYgNzUuNjM3di0xMzMuNzk5eiIgZmlsbD0iIzM5MzkzOSIvPjwvc3ZnPg==',
                  'blockExplorer' => 'https://etherscan.io/address/'.$address,
                  'walvarLink' => 'ethereum:'.$address.'?amount='.$coinsValue . '&message=CHANGEME%2F%2F'.$req->invoice
              ];
              break;
          case 'ETC':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => 'Eth. Classic',
                  'code' => 'ETC',
                  'confirmations' => 0,
                  'icon' => 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMzkgNjQiIHdpZHRoPSIzOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTMuNjk2NTk4NiAyOC42NzY2NDQgMTguODY2MjEzMi03Ljk1MjgzNDUgMTguMjg1NzE0MyA4LjE1NjAwOTEtMTguMzE0NzM5My0yOC44Nzk4MTg2em0uMDU4MDQ5OSA4LjgyMzU4MjggMTguODM3MTg4MiAxMC45MTMzNzg2IDE5LjIxNDUxMjUtMTAuOTEzMzc4Ni0xOS4wNDAzNjI4IDI2LjQ5OTc3MzJ6bTE4Ljg5NTIzODEtMTIuODg3MDc0OSAxOS4wOTg0MTI3IDguNTA0MzA4NC0xOS4wOTg0MTI3IDEwLjY4MTE3OTItMTkuNjQ5ODg2Ni0xMC45MTMzNzg3eiIgZmlsbD0iIzY2OTA3MyIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMpIi8+PC9zdmc+',
                  'blockExplorer' => 'https://etcchain.com/addr/'.$address
              ];
              break;
          case 'BTC':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => 'Bitcoin',
                  'code' => 'BTC',
                  'confirmations' => 0,
                  'icon' => 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjU0IiB2aWV3Qm94PSIwIDAgMzkgNTQiIHdpZHRoPSIzOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNDkuNzc1MTEwNiAzOS43MzQyMDE1YzAtOC43MDg2MTEyLTYuMDg0MDk4My0xMC40OTgwNTE4LTYuMDg0MDk4My0xMC40OTgwNTE4czQuNDEzOTUzNi0xLjQzMTU1MjYgNC40MTM5NTM2LTYuOTE5MTcwNi00LjI5NDY1NzUtOC4zNTA3MjMxLTguMzUwNzIzLTguMzUwNzIzMWMtLjExOTI5NjEgMC0uMzU3ODg4MiAwLS40NzcxODQyIDB2LTcuMTU3NzYyNjFoLTQuNzcxODQxOHY3LjE1Nzc2MjYxYy0xLjU1MDg0ODUgMC0zLjEwMTY5NzEgMC00Ljc3MTg0MTcgMHYtNy4xNTc3NjI2MWgtNC43NzE4NDE4djcuMTU3NzYyNjFjLTEuMzEyMjU2NSAwLTEwLjczNjY0NCAwLTEwLjczNjY0NCAwdjUuOTY0ODAyMmg0Ljc3MTg0MTh2MjUuMDUyMTY5M2gtNC43NzE4NDE4djUuOTY0ODAyMmgxMC43MzY2NDR2Ny4xNTc3NjI2aDQuNzcxODQxOHYtNy4xNTc3NjI2aDQuNzcxODQxN3Y3LjE1Nzc2MjZoNC43NzE4NDE4di03LjI3NzA1ODdjMy40NTk1ODUzLS4xMTkyOTYgMTAuNDk4MDUxOS0yLjYyNDUxMjkgMTAuNDk4MDUxOS0xMS4wOTQ1MzIxem0tMjQuOTMyODczMi0xOS44MDMxNDMzaDEyLjUyNjA4NDZjLjgzNTA3MjMgMCAzLjgxNzQ3MzQtLjM1Nzg4ODEgMy44MTc0NzM0IDQuNDEzOTUzNyAwIDQuNDEzOTUzNi0zLjkzNjc2OTUgMy45MzY3Njk0LTMuOTM2NzY5NSAzLjkzNjc2OTRoLTEyLjQwNjc4ODV6bTEzLjI0MTg2MDggMjMuODU5MjA4OGgtMTMuMjQxODYwOHYtOC4zNTA3MjNoMTMuMjQxODYwOGMuOTU0MzY4NCAwIDQuMDU2MDY1NS0uNTk2NDgwMyA0LjA1NjA2NTUgNC40MTM5NTM2LjExOTI5NjEgNC43NzE4NDE3LTQuMDU2MDY1NSAzLjkzNjc2OTQtNC4wNTYwNjU1IDMuOTM2NzY5NHoiIGZpbGw9IiNmN2FjMzEiIHRyYW5zZm9ybT0ibWF0cml4KC45ODE2MjcxOCAuMTkwODA5IC0uMTkwODA5IC45ODE2MjcxOCAtNC4yMTg5NTUgLTEwLjUwOTU1OSkiLz48L3N2Zz4=',
                  'blockExplorer' => 'https://blockchain.info/address/'.$address
              ];
              break;
          case 'DASH':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => 'Dash',
                  'code' => 'DASH',
                  'confirmations' => 0,
                  'icon' => 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM4IiB2aWV3Qm94PSIwIDAgNjQgMzgiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjMuOTEzNjQ2MiAxOC45NjkwMDk1Yy4yMDkzMjQyIDEuMjkwODMyNC4wMzQ4ODczIDIuNjE2NTUyMS0uNDg4NDIzMSAzLjgwMjcyMjRsLTUuNzU2NDE0NiAxOC4xMDY1NDA2Yy0uNTIzMzEwNCAxLjI1NTk0NS0xLjE1MTI4MjkgMi40NDIxMTUzLTEuOTE4ODA0OSAzLjU5MzM5ODItLjkwNzA3MTQgMS4xNTEyODI5LTEuOTUzNjkyMiAyLjE5NzkwMzgtMy4xMDQ5NzUyIDMuMTA0OTc1Mi0xLjE4NjE3MDMuOTc2ODQ2MS0yLjU4MTY2NDcgMS42NzQ1OTMzLTMuODAyNzIyNCAyLjM3MjM0MDYtMS4yMTg4ODA0LjQ1MDg4MDktMi41MDM1NzI1LjY5ODM5MDQtMy44MDI3MjI0LjczMjYzNDZoLTQzLjYwOTIwMTc4bDMuMTA0OTc1MTctOS4zMTQ5MjU1aDM5LjMxODA1NjMxbDYuMjA5OTUwNC0xOS4wNDg0OTk0aC0zOS4zMTgwNTY0bDMuMTA0OTc1Mi05LjMxNDkyNTVoNDMuMzk5ODc3NmMxLjE1MTI4My0uMDM0ODg3NCAyLjMwMjU2NTkuMjA5MzI0MiAzLjM0OTE4NjcuNzMyNjM0NiAxLjAxMTczMzUuMzgzNzYxIDEuODgzOTE3NiAxLjE1MTI4MjkgMi4zNzIzNDA2IDIuMTI4MTI5LjU1ODE5NzguOTQxOTU4OC44NzIxODQxIDIuMDIzNDY3Ljk0MTk1ODggMy4xMDQ5NzUyem0tMzcuNjc4MzUwNCA4LjU0NzQwMzYtMi44NjA3NjM2IDguNjE3MTc4MmgtMjMuMzc0NTMyMmwzLjEwNDk3NTE3LTguNjE3MTc4MnoiIGZpbGw9IiMxZTc1YmIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEzKSIvPjwvc3ZnPg==',
                  'blockExplorer' => 'https://explorer.dash.org/address/'.$address
              ];
              break;
          case 'XMR':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => 'Monero',
                  'code' => 'XMR',
                  'confirmations' => 0,
                  'icon' => 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMzEuODc0OTg4MyAwYy0xNy42MDEyNDUxIDAtMzEuODc0OTg4MyAxNC4yNzM0OTQyLTMxLjg3NDk4ODMgMzEuODc1MjM3NCAwIDMuNTE4MDA3Ny41NzAyNzIzNyA2LjkwMjAzODkgMS42MjMxNTk1MyAxMC4wNjgxNzEyaDkuNTMzMjYwNjd2LTI2LjgxOTIzNzRsMjAuNzE5MDY2MiAyMC43MTkwNjYyIDIwLjcxODU2ODEtMjAuNzE5MDY2MnYyNi44MTg5ODgzaDkuNTMzMjYwN2MxLjA1MzYzNDItMy4xNjYxMzIzIDEuNjIzOTA2Ni02LjU1MDE2MzQgMS42MjM5MDY2LTEwLjA2ODE3MTItLjAwMDI0OS0xNy42MDIyNDEyLTE0LjI3NDI0MTMtMzEuODc0OTg4My0zMS44NzYyMzM1LTMxLjg3NDk4ODMiIGZpbGw9IiNmNjAiLz48cGF0aCBkPSJtMjcuMTEwODQ4MiA0MC42MDY4Nzk0LTkuMDQyMTc4OS05LjA0MjQyOHYxNi44NzUzMzA3aC0xMy40MzEwMzUwNmM1LjU5NTY0MjA2IDkuMTc5ODkxMSAxNS43MDE0MTYzNiAxNS4zMTAxOTQ2IDI3LjIzNjg1NjA2IDE1LjMxMDE5NDZzMjEuNjQyMjEwMS02LjEzMDMwMzUgMjcuMjM3MTA1LTE1LjMxMDE5NDZoLTEzLjQzMDc4NnYtMTYuODc1NTc5OGwtOS4wNDIxNzg5IDkuMDQyMTc5LTQuNzYzODkxMSA0Ljc2MzY0Mi00Ljc2MzM5My00Ljc2MzM5MjloLS4wMDA0OTgxeiIgZmlsbD0iIzRjNGM0YyIvPjwvZz48L3N2Zz4=',
                  'blockExplorer' => 'https://moneroblocks.info/tx/'.$address
              ];
              break;
          case 'WAVES':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => 'Waves',
                  'code' => 'WAVES',
                  'confirmations' => 0,
                  'icon' => 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im01Mi44NDQ1MTcyIDE4LjAyNjg0MTItMTUuODU4NTkyNS0xNS44NjkwNjcwNmMtMi43NDQzNTM1LTIuNzQ0MzUzNTItNy4yMjc0OTU5LTIuNzQ0MzUzNTItOS45NjEzNzQ4IDBsLTE1Ljg0ODExNzggMTUuODM3NjQzMTZjLS45MTEyOTMuOTExMjkzLS45MTEyOTMgMi40MDkxNjU0IDAgMy4zMjA0NTgzbDQuODA3ODU2IDQuODA3ODU2IDMuMTk0NzYyNiAyLjk1Mzg0NjFjLjk1MzE5MTUuODc5ODY5MSAyLjM5ODY5MDcuODc5ODY5MSAzLjM1MTg4MjIgMGw2LjQtNS45MTgxNjY5YzEuNzU5NzM4MS0xLjYyMzU2NzkgNC40NjIxOTMxLTEuNjIzNTY3OSA2LjIxMTQ1NjYgMGw2LjQgNS45MTgxNjY5Yy45NDI3MTY5Ljg3OTg2OTEgMi4zOTg2OTA3Ljg3OTg2OTEgMy4zNDE0MDc2IDBsMy4xOTQ3NjI2LTIuOTUzODQ2MSA0Ljc2NTk1NzUtNC43NjU5NTc1Yy45MjE3Njc2LS45MjE3Njc2LjkyMTc2NzYtMi40MDkxNjUzIDAtMy4zMzA5MzI5IiBmaWxsPSIjM2RiNmQzIi8+PHBhdGggZD0ibTIuMTQ3Mjk5NTEgMzYuOTk2Mzk5MyAyNC44NjY3NzU3OSAyNC44NjY3NzU4YzIuNzQ0MzUzNSAyLjc0NDM1MzUgNy4yMjc0OTU5IDIuNzQ0MzUzNSA5Ljk2MTM3NDggMGwyNC44NjY3NzU4LTI0Ljg2Njc3NThjNC4zMTU1NDgyLTQuMzE1NTQ4MiAxLjI3NzkwNS01LjU4Mjk3ODctMS44ODU0MzM4LTguNTc4NzIzNGwtMy44OTY1NjMtMy42OTc1NDVjLS45NDI3MTY4LS44OTAzNDM3LTIuMzk4NjkwNi0uODc5ODY5LTMuMzUxODgyMSAwbC02LjQgNS45MTgxNjdjLTEuNzU5NzM4MiAxLjYyMzU2NzktNC40NjIxOTMyIDEuNjIzNTY3OS02LjIxMTQ1NjcgMGwtNi40LTUuOTE4MTY3Yy0uOTQyNzE2OC0uODc5ODY5LTIuMzk4NjkwNi0uODc5ODY5LTMuMzQxNDA3NSAwbC02LjQgNS45MTgxNjdjLTEuNzU5NzM4MSAxLjYyMzU2NzktNC40NjIxOTMxIDEuNjIzNTY3OS02LjIxMTQ1NjYgMGwtNi40LTUuOTE4MTY3Yy0uOTUzMTkxNS0uODc5ODY5LTIuMzk4NjkwNjgtLjg3OTg2OS0zLjM1MTg4MjE3IDBsLTMuNTgyMzI0MDYgMy4zMDk5ODM3Yy0zLjI4OTAzNDM3IDMuMDU4NTkyNC02Ljc2NjYxMjExIDQuNDYyMTkzMS0yLjI2MjUyMDQ2IDguOTY2Mjg0NyIgZmlsbD0iI2UyZTFlMSIvPjwvZz48L3N2Zz4=',
                  'blockExplorer' => 'https://wavesexplorer.com/address/'.$address
              ];
              break;
          case 'EOS':
              return (object)[
                  'address' => $address,
                  'coinsValue' => $coinsValue,
                  'rate' => $rate,
                  'title' => 'Eos',
                  'code' => 'EOS',
                  'confirmations' => 0,
                  'icon' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAA9CAAAAADXfFsjAAAC0klEQVRIx9WXra70IBCGz42dq9lL6CXsNWBISEhIKjAoVFUdDlNTg8EgqhCIJuT9RH+3Z88p3aqvYtOS7sN0Zt6Z4Qt3r6/TN0y+SWi/1T2CJ4T0dwgj9TSQeIOgWpBs688JnUAmCdJ8SogkIpOERMKHBGGBTBLgaP6IYBRmAprmE0IgaSVk5q4TMnVYCTPuGmE2fCbAyqsEx/ILAbW9RlgDGB5uCe1wiaDmJMrM0HG67Xm+QLBii6hu53vdlBPiIqZEItLyMFJfTBBmUxawKsuRUkKumiWp8j6dukcqJAxk3pVPxSXMslDvis1bgm3EAABd/RKZkZmmkKBcYwCMawZMnu1lrMsImSdfvwrSKADagqciQhTINGEg405mHplGKFdE6DWgulchOIogAGOKCI0FOu35y6LsTAt4VUQQAUj0UBsjpQFIP7XxhpBYBvDkh2VdAUAdCghOAkiVPlbNxwCgMQWEtgWglTjYK7UE0KsCQu2BQLI4+iEzB0R2Thj5CIhuMmWX6RqeZkAMp4QggZ4D4RDNHlAW0P0pwbbI1AOZDi91cwQiSbDNKUH1MBJHt3dy7gChPiNkHuey5sVLSk6WDPkorh+EgaNp5zIdd5PI2nekOyFYHRdN6k1arl40Gkx7QtC9svvkPMAcD/KEUNs1iuPabfM2Skkrxj8JUez6/OQ+AJ5ufmIHcR0J/rkzchWB3gW2eXZ/EppH3M+Cs8Fsv1jVfxKePMXtYl2MMUZHdmtxKhS/EsiDCb5c4lkJzrmoqt0af1T5L8LY0J100uRBuvOdZzqdaZPLTVLcAxjIumlUP/r3u0prabv8xTTLz/RIyqo9kl6SIrIMiHlbz2UsnmE8V9PLPCBOnXvDFs5ys8FtC6sBwJI2X5wno2IeCAzCAUHI+MFc7ahOoJ4cQnxlts+GdIY1/W8fUHLGiYp8P+Vw66znSHf3vHn/xPo/EP4BiV3eIZgOCrEAAAAASUVORK5CYII=',
                  'blockExplorer' => 'https://etherscan.io/token/EOS?a='.$address
              ];
              break;
          default:
              echo 'currency '.$code.' not found';
              return null;
      }
  }

  echo 'can\'t get rate for '.$code;
  return null;
}

function getCurrencies($curCodes, $address, $req) {
    $currs = [];

    foreach ($curCodes as $code) {
        $curr = getCurrency($code, $address, $req);
        if($curr) {
            $currs[] = $curr;
        }
    }
    return (object)$currs;
};
