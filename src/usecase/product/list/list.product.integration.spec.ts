import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductsUseCase from "../list/list.product.usecase";
import Product from "../../../domain/product/entity/product";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";
import ProductFactory from "../../../domain/product/factory/product.factory";


describe("Integration Test list product use case", () => {
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

	it("should list products", async () => {
		const productRepository = new ProductRepository();
		const useCase = new ListProductsUseCase(productRepository);

		const product1 = new Product("1", "Product A", 1.99);
		await productRepository.create(product1);
 
		const product2 = new Product("2", "Product B", 2.99);
		await productRepository.create(product2);

		const input: InputListProductDto = {
		};

		const result = await useCase.execute(input);
		
		expect(result.products.length).toBe(2);
		expect(result.products[0].id).toBe(product1.id);
		expect(result.products[0].name).toBe(product1.name);
		expect(result.products[0].price).toBe(product1.price);
		expect(result.products[1].id).toBe(product2.id);
		expect(result.products[1].name).toBe(product2.name);
		expect(result.products[1].price).toBe(product2.price);
		});
});