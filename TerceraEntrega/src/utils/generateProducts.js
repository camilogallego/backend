import { faker } from "@faker-js/faker";

faker.locale = "es";

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: faker.random.numeric(1),
    id: faker.database.mongodbObjectId(),
    thumbnails: faker.image.image(),
    description: faker.lorem.paragraph(),
    code: faker.datatype.uuid(),
  };
};
