package com.nexcart.service;

import com.nexcart.dto.ProductResponse;
import com.nexcart.dto.ProductRequest;
import com.nexcart.entity.Product;
import com.nexcart.entity.User;
import com.nexcart.exception.ResourceNotFoundException;
import com.nexcart.repository.OrderItemRepository;
import com.nexcart.repository.ProductRepository;
import com.nexcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final OrderItemRepository orderItemRepository;

	// Seller Related Methods

	public String createProduct(ProductRequest request, Authentication authentication) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Product product = Product.builder().name(request.getName()).description(request.getDescription())
				.price(request.getPrice()).category(request.getCategory()).quantity(request.getQuantity())
				.available(request.getQuantity() > 0).imageUrl(request.getImageUrl()).createdAt(LocalDateTime.now())
				.seller(seller).build();

		productRepository.save(product);

		return "Product created successfully";
	}

	public String updateProduct(Long productId, ProductRequest request, Authentication authentication) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Product product = productRepository.findByIdAndSellerId(productId, seller.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Product not found or you are not the owner"));

		product.setName(request.getName());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setCategory(request.getCategory());
		product.setQuantity(request.getQuantity());
		product.setAvailable(request.getQuantity() > 0);
		product.setImageUrl(request.getImageUrl());

		productRepository.save(product);

		return "Product updated successfully";
	}

	@Transactional
	public void deleteProduct(Long productId, Authentication authentication) {

		User seller = userRepository.findByEmail(authentication.getName())
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Product product = productRepository.findByIdAndSellerId(productId, seller.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		// Product is already part of an order
		if (orderItemRepository.existsByProductId(productId)) {

			product.setQuantity(0);
			product.setAvailable(false);

			productRepository.save(product);

			return;
		}

		// Product has never been ordered
		productRepository.delete(product);
	}

	public Page<ProductResponse> getSellerProducts(Authentication authentication, int page, int size) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Pageable pageable = PageRequest.of(page, size);

		return productRepository.findBySellerId(seller.getId(), pageable).map(this::convertToResponse);
	}

	public ProductResponse getSellerProduct(Long productId, Authentication authentication) {

		String email = authentication.getName();

		User seller = userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("Seller not found"));

		Product product = productRepository.findByIdAndSellerId(productId, seller.getId())
				.orElseThrow(() -> new ResourceNotFoundException("Product not found or you are not the owner"));

		return convertToResponse(product);
	}

	// Admin Related Methods

	public List<ProductResponse> getAllProductsForAdmin() {

		List<Product> products = productRepository.findAllByOrderByCreatedAtDesc();

		if (products.isEmpty()) {
			throw new ResourceNotFoundException("No products found");
		}

		return products.stream().map(this::convertToResponse).toList();
	}

	public ProductResponse getProductForAdmin(Long productId) {

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		return convertToResponse(product);
	}

	public String deleteProductByAdmin(Long productId) {

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found"));

		if (orderItemRepository.existsByProductId(productId)) {

			product.setQuantity(0);
			product.setAvailable(false);

			productRepository.save(product);

			return "Product has existing orders and was marked unavailable";
		}

		productRepository.delete(product);

		return "Product deleted successfully";
	}

	// Retrieving Products Methods

	public Page<ProductResponse> getProducts(String search, String category, int page, int size) {

		Pageable pageable = PageRequest.of(page, size);

		Page<Product> products;

		if (search != null && !search.isBlank() && category != null && !category.isBlank()) {

			products = productRepository.findByNameContainingIgnoreCaseAndCategoryIgnoreCase(search, category,
					pageable);

		} else if (search != null && !search.isBlank()) {

			products = productRepository.findByNameContainingIgnoreCase(search, pageable);

		} else if (category != null && !category.isBlank()) {

			products = productRepository.findByCategoryIgnoreCase(category, pageable);

		} else {

			products = productRepository.findAll(pageable);
		}

		return products.map(this::convertToResponse);
	}

	public ProductResponse getProductById(Long id) {

		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

		return convertToResponse(product);
	}

	private ProductResponse convertToResponse(Product product) {

		return ProductResponse.builder().id(product.getId()).name(product.getName())
				.description(product.getDescription()).price(product.getPrice()).category(product.getCategory())
				.quantity(product.getQuantity()).available(product.isAvailable()).imageUrl(product.getImageUrl())
				.sellerName(product.getSeller().getName()).build();
	}
}