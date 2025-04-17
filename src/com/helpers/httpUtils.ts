export const getBase64FromUrl = async (url: string) => {
  return new Promise<
    | string
    | ArrayBuffer
    | {
        url: string;
        width: number;
        height: number;
      }
  >((resolve, reject) => {
    const _img = new Image();
    _img.crossOrigin = 'anonymous';
    _img.onload = () => {
      resolve({
        url: url,
        width: _img.width,
        height: _img.height,
      });
    };
    _img.onerror = () => {
      resolve('');
    };
    const _container = document.getElementById('imgContainer');
    if (_container) _container.append(_img);
    _img.src = url;
  });
};

