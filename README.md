# StyleVault Backend

This is the backend application for StyleVault, a platform for finding and buying the latest fashion and beauty items. This application provides APIs to manage item inventory, make purchases during live shows, and retrieve information about sold items.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [POST /inventory](#post-inventory)
  - [POST /show/:show_ID/buy_item/:item_ID](#post-showshow_idbuy_itemitem_id)
  - [GET /show/:show_ID/sold_items/:item_id](#get-showshow_idsold_itemsitem_id)
- [Testing](#testing)

## Getting Started

To get the application up and running on your local machine, follow the instructions below.

### Prerequisites

Make sure you have the following software installed on your system:

- Node.js (version 16 or higher)
- npm (Node Package Manager)
- MySQL

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/beedyboy/StyleVault.git
   ```

2. Navigate to the project directory:

   ```shell
   cd StyleVault
   ```

3. Install the dependencies using either `npm ci` or `npm install`:

   ```shell
   npm ci
   ```

   **Note:** If `npm ci` fails, use `npm install` instead.

### Configuration

The application uses environment variables for configuration. Create a new file named `.env` in the project root directory and provide the required variables. You can find a sample `.env.example` file in the repository that you can copy the content from:

```plaintext
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=stylevault
```

Make sure to replace `your_username` and `your_password` with your MySQL database credentials.

### Database Setup

1. Create a new MySQL database named `stylevault`.

2. The database tables will be automatically created by TypeORM when you run the application.

### Running the Application

Before starting the application, build it using the following command:

```shell
npm run build
```
Then

```shell
npm start
```

### Or
Start the application in local development mode using the following command:

```shell
npm run start:dev
```

The application will start running on the specified port (default: 3000) and connect to the configured MySQL database.

## API Endpoints

The following API endpoints are available:

### POST /inventory

Add or update item inventory in stock right now.

- Request:

  ```plaintext
  POST /inventory
  ```

  Request Body:

  ```json
  [
    {
      "itemID": 12345,
      "itemName": "Fancy Dress",
      "quantity": 10
    }
  ]
  ```

### POST /show/:show_ID/buy_item/:item_ID

Buy a single item during a show.

- Request:

  ```plaintext
  POST /show/:show_ID/buy_item/:item_ID
  ```

  Parameters:
  - `show_ID`: The ID of the show.
  - `item_ID`: The ID of the item to be purchased.

### GET /show/:show_ID/sold_items/:item_id

Retrieve information about sold items.

- Request:

  ```plaintext
  GET /show/:show_ID/sold_items/:item_id
  ```

  Parameters:
  - `show_ID`: The ID of the show.
  - `item_id` (optional): The ID of the item. If not provided, returns information about all items sold by the show.

## Testing

The application includes unit tests to ensure the correctness of the implemented functionality. You can run the tests using the following command:

```shell
npm test
```
``` 