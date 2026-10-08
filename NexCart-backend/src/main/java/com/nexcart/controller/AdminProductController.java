package com.nexcart.controller;
 
import com.nexcart.dto.ProductResponse;
import com.nexcart.service.ProductService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin - Products", description = "Admin product management APIs")
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProductsForAdmin()
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> getProduct(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                productService.getProductForAdmin(productId)
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long productId) {

        return ResponseEntity.ok(
                productService.deleteProductByAdmin(productId)
        );
    }
}
