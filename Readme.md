## Inori Yuzuriha Bot (whatsapp-bot)

## **Install depedencies:**

```bash
> npm i
```

## **Config:**

-   Buka strings.js
-   Setting ownerNumber: 628xxxx@c.us
    <br><em>Note: jangan lupa diawali 628 dan diakhiri @c.us</em>

## **Usage**

```bash
> npm start
```

## **Troubleshooting**

Make sure all the necessary dependencies are installed. https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Fix Stuck on linux, install google chrome stable:

```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

Jika ngestuck di **Installing patches** ikuti langkah berikut:

-   Buka `node_modules/@open-wa/wa-automate/package.json`
-   Ubah pada bagian patches menjadi salah satu link dibawah
-   Link 1 `https://raw.githubusercontent.com/open-wa/wa-automate-nodejs/master/patches.json`
-   atau
-   Link 2 `https://raw.githack.com/open-wa/wa-automate-nodejs/master/patches.json`
-   Coba kedua link tersebut sampai **Installing patches** ke lewat