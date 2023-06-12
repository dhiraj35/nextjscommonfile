// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environment variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  // when `next build` or `npm run build` is used
  const isStaging = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  // console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`)

  const env = {
    serverConfig: (() => {
      if (isDev)
        return {
          server: 'Development',
          url_next: '192.168.40.170:3012', //NextJs server
          url_api: '192.168.40.170:4901', // Node API
          url_csgenio: 'http://srinivasgajangi.genio.jd/csgenio_dev',
          url_fastapi: '192.168.40.170:3013',
          wrapperUrl: 'http://dhirajkumary.genio.jd/V-module/vm_module15feb2023/wrapper/',
          url_php:'srinivasgajangi.genio.jd'
        };

      // Staging = UAT
      if (isStaging)
        return {
          server: 'UAT',
          url_next: '192.168.24.133:3006', //NextJs server
          url_api: '192.168.24.133:3005', // Node API
          url_csgenio: 'http://192.168.24.133:81',
          url_fastapi: '192.168.24.133:3007', //FastAPI
          wrapperUrl: 'http://192.168.24.133:81/vaccounts/PHP/wrapper/',
          url_php:'192.168.24.133:81'
        };

      if (isProd)
        return {
          server: 'Production',
          url_next: '192.168.17.112:3008', //NextJs server
          url_api: '192.168.17.112:3005', // Node API
          url_csgenio: 'http://192.168.17.112:81',
          url_fastapi: '192.168.17.112:3009', //FastAPI
          wrapperUrl: 'http://192.168.17.115:81/vaccounts/PHP/wrapper/',
          url_php:'192.168.17.115:81'
        };
    })(),
  };

  // next.config.js object
  return {
    env,
    reactStrictMode: true,
    distDir: 'build',
  };
};
