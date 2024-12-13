<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--<%@include file="header1.jsp" %>--%>
<%@page import="java.util.Date, java.util.Scanner, java.sql., java.util.logging." %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title> Product Page </title>
    </head>
    <body>
        <h3>Dashboard - Products Management Application</h3
        <br/>
        <br/><!-- comment -->
        <c:choose  >
            <c:when test="${products.size() > 0}">
                    <table class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Category</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach items="${products}" var="product">
                    <tr>
                        <td><c:out value="${product.name}"></c:out>"</td>
                        <td><c:out value="${product.description}"></c:out>></td>
                        <td><c:out value="${product.price}"></c:out></td>
                        <td><c:out value="${product.category}"></c:out></td>
                        <td><a href="edit.jsp?id=<c:out value="${product.id}"></c:out>" class="btn btn-warning">Edit</a><a href="delete.jsp?id=<c:out value="${product.id}"></c:out>" class="btn btn-danger">Delete</a></td>
                    </tr>
                </c:forEach>
                                                  
            </tbody>
        </table>
                    </c:when>
                    <c:otherwise >
                        <p> No products yet </p>
                    </c:otherwise>
        </c:choose>
        
    </body>
</html>