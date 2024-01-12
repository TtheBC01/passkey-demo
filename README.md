# Passkey demo in straight HTML

Playing around with the [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API). 

## Run locally:

```shell
docker run -it --rm --entrypoint bash -p 8000:8000 -v /path/to/passkey-demo/:/root/app python
cd /root/app
python -m http.server
```

## Iframe compatibility

By adding `allow="publickey-credentials-get *"` to an iframe element, you can request signatures from a passkey generated by a third party domain.

```html
<iframe src="https://toddchapman.io/passkey-demo/" allow="publickey-credentials-get *" title="Passkey Demo">
</iframe>
```