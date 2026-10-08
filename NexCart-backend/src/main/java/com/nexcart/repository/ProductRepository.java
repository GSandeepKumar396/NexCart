package com.nexcart.repository;

import com.nexcart.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

	Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);

	Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);

	Page<Product> findByNameContainingIgnoreCaseAndCategoryIgnoreCase(String name, String category, Pageable pageable);

	Page<Product> findBySellerId(Long sellerId, Pageable pageable);

	Optional<Product> findByIdAndSellerId(Long productId, Long sellerId);

	List<Product> findAllByOrderByCreatedAtDesc();
	
	boolean existsByIdAndAvailableTrue(Long productId);
}