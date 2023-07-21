import { load } from "js-yaml";
import { readFileSync } from "fs";

const components = load(
  readFileSync("./src/docs/components.yaml", "utf8")
);
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Ecommerce API Documentation",
      description:
        "Ecommerce api documentation. It includes product and cart modules documentation",
    },
    components: components.components, // add this line
  },
  apis: [`${process.cwd()}/src/docs/**/*.yaml`],
};

export default swaggerOptions;
