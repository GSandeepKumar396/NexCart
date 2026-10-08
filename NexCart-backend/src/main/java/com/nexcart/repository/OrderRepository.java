package com.nexcart.repository;

import com.nexcart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        LEFT JOIN FETCH o.items
        WHERE o.id = :orderId
        AND o.user.id = :userId
    """)
    Optional<Order> findOrderWithItems(
            @Param("orderId") Long orderId,
            @Param("userId") Long userId
    );

    @Query("""
        SELECT DISTINCT o
        FROM Order o
        JOIN o.items oi
        JOIN oi.product p
        WHERE p.seller.id = :sellerId
        ORDER BY o.createdAt DESC
    """)
    List<Order> findOrdersBySellerId(
            @Param("sellerId") Long sellerId
    );
    
    
    @Query("""
    	    SELECT DISTINCT o
    	    FROM Order o
    	    JOIN FETCH o.items oi
    	    JOIN FETCH oi.product p
    	    WHERE o.id = :orderId
    	    AND p.seller.id = :sellerId
    	""")
    	Optional<Order> findOrderForSeller(
    	        @Param("orderId") Long orderId,
    	        @Param("sellerId") Long sellerId
    	);
    
    @Query("""
    	    SELECT DISTINCT o
    	    FROM Order o
    	    LEFT JOIN FETCH o.items oi
    	    LEFT JOIN FETCH oi.product
    	    ORDER BY o.createdAt DESC
    	""")
    	List<Order> findAllOrdersWithItems();
}