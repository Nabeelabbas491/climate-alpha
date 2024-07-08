// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  API_DOCS_URL: "https://development.alphageo.ai/api/documentation",
  BACKEND_URL: "https://development.alphageo.ai/api/",
  // BACKEND_URL: "https://test.alphageo.ai/api/",

  // BACKEND_URL: "http://127.0.0.1:8000/api/",
  PDF_SERVICE_URL: "http://127.0.0.1:3000/",
  FRONTEND_URL: "http://localhost:4200/",
  production: false,
};
