<h1 align="center">Orderly MS Financial</h1>

<p align="center">
  <a href="#-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
   <a href="#-project">Links</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Tecnologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-running">Running</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p align="center">
  <a href="#-license">
    <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=ed2945&labelColor=000000">
  </a>
</p>

## 💻 Project

Overview
This microservice is designed to handle payment processing for orders. It provides backend routes that facilitate various payment-related operations, ensuring a seamless and secure transaction process.
Key Features

    Create Payment: Initiates a payment process for a specified order.
    Cancel Payment: Allows cancellation of a payment using the order ID.
    Find Payment: Retrieves payment details for a specific order.
    Pay Order: Completes the payment process for an order.

Backend Routes

    GET /payments/{orderId}: Fetches payment information for the specified order ID.
    POST api/payments/{orderId}: Creates a new payment for an order.
    DELETE /payments/{orderId}: Cancels the payment associated with the specified order ID.

## ✨ Quality

| Quality Gate Status | Coverage |
| --- | --- |
| [![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=tribofustack_ms-financial)](https://sonarcloud.io/summary/new_code?id=tribofustack_ms-financial) | [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=tribofustack_ms-financial&metric=coverage)](https://sonarcloud.io/summary/new_code?id=tribofustack_ms-financial) |
