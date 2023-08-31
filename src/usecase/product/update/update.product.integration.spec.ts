import { Sequelize } from "sequelize-typescript";
import { InputUpdateProductDto, OutputUpdateProductDto } from "./update.product.dto";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration Test update product use case", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		sequelize.addModels([ProductModel]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should update a product", async () => {
		const productRepository = new ProductRepository();
		const useCase = new UpdateProductUseCase(productRepository);

		const product1 = new Product("1", "Product A", 1.99);

		await productRepository.create(product1);

		const input: InputUpdateProductDto = {
			id: product1.id,
			name: "Product B",
			price: 2.99,
		};

		const expectedOutput: OutputUpdateProductDto = {
			id: product1.id,
			name: "Product B",
			price: 2.99,
		};

		const result = await useCase.execute(input);
		expect(result).toEqual(expectedOutput);
	});

});