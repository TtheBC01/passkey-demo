# Passkey Demo in straight HTML

Playing around with the [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API). 

## Run Locally:

```shell
docker run -it --rm --entrypoint bash -p 8000:8000 -v /path/to/passkey-demo/:/root/app python
cd /root/app
python -m http.server
```
