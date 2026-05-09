# Deploy to 168.144.41.111 — GitHub Actions CI/CD

`claude/skycharter-mongolia-deploy-cjJGs` буюу `main` руу push хийх бүрд GitHub Actions
автоматаар droplet дээр deploy хийнэ. Доорх **5 алхмыг нэг удаа** хийсний дараа автомат болно.

## 1. Droplet дээр public SSH key-г authorized_keys-д нэмэх

`168.144.41.111` рүү одоогийн SSH-аараа нэвтэрч:

```bash
ssh root@168.144.41.111
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOdVDoBaYWK2Ex+/28MIMoqng2J+AgSP/LcW7nVodTQW user@TEM-laptop6' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

> Хэрэв таны GitHub Actions deploy key нь өөр key бол түүний public key-г нэмнэ үү. Доорх Step 3 дээр та яг ийм утгаа GitHub repo secret-д `SSH_PRIVATE_KEY` нэрээр оруулна.

## 2. Droplet дээр Docker суулгасан байх

Workflow эхэлж шалгаад суулгана, гэхдээ урьдчилж бэлдсэн нь хурдан:

```bash
ssh root@168.144.41.111 'apt-get update && apt-get install -y docker.io docker-compose-plugin git && systemctl enable --now docker'
```

## 3. GitHub repository secrets

`https://github.com/Temuujinhub/skycharter/settings/secrets/actions` хуудас руу орж дараах **3 secret** нэмнэ:

| Нэр | Утга |
|---|---|
| `SSH_PRIVATE_KEY` | Тухайн public key-н хувийн (private) хэсэг бүхэлд нь, `-----BEGIN OPENSSH PRIVATE KEY-----`-ээс эхлээд `-----END OPENSSH PRIVATE KEY-----` хүртэл. |
| `POSTGRES_PASSWORD` | Postgres-н нууц үг. Жишээ нь `openssl rand -base64 24` |
| `NEXTAUTH_SECRET` | NextAuth JWT signing key. Жишээ нь `openssl rand -base64 32` |

## 4. Push хийх

Энэ branch (`claude/skycharter-mongolia-deploy-cjJGs`) рүү push хийсний дараа:

1. `Actions` tab-аас "Deploy to DigitalOcean droplet" workflow ажиллаж эхлэнэ.
2. ~3-5 минутын дотор:
   - Droplet дээр код татна
   - `.env.production`-г GitHub secret-аар бичнэ
   - `bash deploy/deploy.sh` ажиллана (Docker build → Postgres → migrate → seed)
   - Smoke test http://168.144.41.111 200 буцааж байгаа эсэхийг шалгана
3. Амжилттай бол **http://168.144.41.111** руу нэвтэрч ашиглах боломжтой.

## 5. Эхний нэвтрэх мэдээлэл

| Үүрэг | Имэйл | Нууц үг |
|---|---|---|
| Админ | `admin@skycharter.mn` | `Admin@2026` |
| Нисгэгч | `pilot@skycharter.mn` | `Pilot@2026` |
| Үйлчлүүлэгч | `demo@skycharter.mn` | `Demo@2026` |

## Гар аргаар (manual) deploy хийх (заавал биш)

GitHub Actions ажиллахгүй үед, эсвэл шууд тест хийх хэрэгтэй бол:

```bash
ssh root@168.144.41.111
cd /opt/skycharter
git pull
bash deploy/deploy.sh
```

## Алдаа засах

- **Workflow dropping at SSH step**: GitHub secret `SSH_PRIVATE_KEY` буруу байна, эсвэл droplet-н `authorized_keys`-д тохирох public key байхгүй.
- **Build алдаа `out of memory`**: 1GB RAM droplet бол `swap` нэмнэ:
  ```bash
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ```
- **502 from nginx**: `docker compose -f /opt/skycharter/deploy/docker-compose.yml logs app` руу ороод алдаа харна.
- **Map хоосон**: OSM tile сүлжээний асуудал. `chrome devtools` дээр network tab шалга.
