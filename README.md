# COMP3500SEF Group project 
**Github link: https://github.com/sunnychen-0717/3500sef_gp_15_foodorderingapp** 


## Project group infomation  
Project name:food ordering and tracking app  
Group no: 15  
Group member:  
Wang ChenXi (13485478)(Group Leader)     
Li Hoi Lam (13178663)   
Leung Chun Ho (13724170)     
Shi Lei (13274583)   
Chen Cheuk Ngai (13822291)     
Ng Chun Pong (13319138)     
 


# Project introduction  
In this project, we create a food ordering and tracking app can let the user create their own account. Then they can browse the menu to place the order to buy the food. Then restaurant will base on the order producing the food and pass it to delivery person to deliver the food to the customers

## Project file intro:
This project uses a modern React + Vite architecture with Firebase as the backend service.

    Foodorderdelivery/:

        src/:

            FoodDeliveryApp.jsx: This is main part of the FoodDeliveryApp, including all the visuals, logic, and interactions with the Firebase backend.

            firebase.js: This file stores the Google Firebase API. You can change the API here.

            main.jsx: It makes sure webpage is using FoodDeliveryApp.jsx file,otherwise, you willsee a blank screen.

            index.css: Three directives primarily used to import Tailwind CSS

        package.json: Like requirement.txt, make sure that everyone have the same downloaded version and that they are in the same environment.

        package-lock.json: Lock version number, make sure that everyone have the same downloaded version

        tailwind.config.js: The configuration file of Tailwind CSS 

        postcss.config.js: Convert Tailwind syntax into browser-compatible CSS to simplify maintenance.

        vite.config.js: The configuration file of vite.

        eslint.config.js: Work to make sure that the code is written in a standard form.

        index.html: React will put the completed app into this.


# Operation guides
## Before opening checklist  
First please download all this file in the github and the run it in the Visual studio code  
Second please make sure you have alreadly download Node.js, if not, please download it in the https://nodejs.org/  

## How to start and run 
1. Open Visual studio code.  
2. Go to "File" > "Open Folder".  
3. Select the folder named "Foodorderdelivery" (the one containing package.json).
4. Open the Integrated Terminal (Ctrl + `)
5. input the comand: npm install
6. input the comand: npm install tailwindcss@3.4.17 postcss autoprefixer
7. input the comand: npm run dev
Then it will show the output run it on the:http://localhost:5173 and click it

# User guides in the app
## Authentication (Log in & Sign up)

    Launch the app. And you will be presented the Login screen.

    Click on "Sign Up" to sign up a new account. (Need email and password)

    Once registered, you will be automatically logged in to the system.

    Firebase Authentication takes care of this layer of security in the backend.
<img width="459" height="881" alt="image" src="https://github.com/user-attachments/assets/33bf3754-7176-4198-adc3-4f13e9e7bbff" />
<img width="455" height="881" alt="image" src="https://github.com/user-attachments/assets/d25825e5-9dde-4aef-a55d-1a77fb4e80f9" />

## LBS Location Tracking (GPS Function)

    On the Home screen, it at the top.

    Click the bar.

    Your browser would request the permission; please select "Allow". Otherwise, it will not display correctly

    System will get your real time GPS coordinates (Latitude/Longitude) and use a Google Map to display your current location.
<img width="447" height="887" alt="image" src="https://github.com/user-attachments/assets/943e10f9-3b1b-4666-9e80-0d7560f1715f" />

## Browsing & Ordering

    Now scroll down in the "Popular Restaurants" list on Home screen.

    Click on different restaurant to see what the menu is.

    Click on a food item (i.e., Classic Cheeseburger), change the number of foods and click on "Add to Cart".

    You can add several of them, from different categories.
<img width="448" height="887" alt="image" src="https://github.com/user-attachments/assets/6a2e19f2-f77c-4c2f-9f79-fdc876475c6c" />


## Favorites Management

    While surfing, click 'Heart' at the top right corners of any restaurant card.

    This action defines the restaurant as a favorite.

    To view your Favorites list, Click on a (Heart icon), "Favorites" tab  on the bottom navigation bar.
<img width="442" height="880" alt="image" src="https://github.com/user-attachments/assets/03165bfe-5507-465a-a295-b7903c7d433a" />

## Checkout Process

    Go to the Cart (Shopping Bag icon) on the bottom.

    You can see your select food and the amount you need to pay (includ delivery fee).

    Click the "Checkout" button.

    The system will create a unique Order ID (e.g. ORD-X7B29A) and store the order in the Cloud Firestore database.
<img width="459" height="888" alt="image" src="https://github.com/user-attachments/assets/ddbde1f8-f221-4895-8392-e95ae452aa1e" />


## Real time Order Tracking (Sync Feature)

    Once checkout is done, you will be redirected to the Tracking page with the Order ID and status (Default - Pending) of your order.

    To view your order history.
    
    Go to the "Orders" tab (Clock icon) .
<img width="451" height="882" alt="image" src="https://github.com/user-attachments/assets/f3cade43-7c43-42e8-a5ba-6a212ed767ed" />
<img width="1600" height="791" alt="image" src="https://github.com/user-attachments/assets/50d608c9-4c4c-4746-b46d-e36d5402298c" />


## Profile Management

    Access account settings by going to the "Profile" tab(Human icon).

    Edit Profile: Edit your personal information (Name, Email, Phone Number).

    Saved Addresses: Edit your delivery locations (e.g Home or Work addresses).

    Payment Methods: Edit your Payment information (Visa/Mastercard) 

    Notifications: Set your delivery order notification and promotions.

    Settings: Set your app interface (Language, Theme)

    Log Out: Go back to the Login screen.
<img width="450" height="887" alt="image" src="https://github.com/user-attachments/assets/8346ee4f-3c42-496b-9362-717a2ca673f0" />

    
