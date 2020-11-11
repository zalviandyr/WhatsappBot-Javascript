## Inori Yuzuriha Bot (whatsapp-bot)

## **Install depedencies:**

```bash
> npm i
```

## **Config:**

-   Buka config.yml
-   Setting ownerNumber: 628xxxx@c.us
    <br><em>Note: jangan lupa diawali 628 dan diakhiri @c.us</em>
-   Setting chrome menjadi letak aplikasi chrome.exe
    <br><em>Windows: C:\\\Program Files\\\Google\\\Chrome\\\Application\\\chrome.exe</em>
    <br><em>Note: jangan lupa double slash</em>

## **Usage**

```bash
> npm start
```

## **Note**
Jika ngestuck di **Installing patches** ikuti langkah berikut:
-   Buka `node_modules/@open-wa/wa-automate/package.json`
-   Ubah pada bagian patches menjadi salah satu link dibawah 
-   Link 1 `https://raw.githubusercontent.com/open-wa/wa-automate-nodejs/master/patches.json`
-   atau
-   Link 2 `https://raw.githack.com/open-wa/wa-automate-nodejs/master/patches.json`
-   Coba kedua link tersebut sampai **Installing patches** ke lewat 
