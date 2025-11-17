/**
 * Foxy Confidential C++ High-Performance REST API Server
 * Built with Crow framework for ultra-fast restaurant data serving
 */

#include "crow_all.h"
#include <json/json.h>
#include <vector>
#include <string>
#include <memory>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <ctime>

using namespace std;

// Restaurant structure
struct Restaurant {
    int id;
    string name;
    string cuisine;
    string location;
    string priceRange;
    string review;
    int openSince;
    struct Ratings {
        double food;
        double taste;
        double ambiance;
        double creativity;
        double uniqueness;
        
        double overall() const {
            return (food + taste + ambiance + creativity + uniqueness) / 5.0;
        }
    } ratings;
    vector<string> awards;
    vector<string> highlights;
    
    // Convert to JSON
    Json::Value toJson() const {
        Json::Value json;
        json["id"] = id;
        json["name"] = name;
        json["cuisine"] = cuisine;
        json["location"] = location;
        json["priceRange"] = priceRange;
        json["review"] = review;
        json["openSince"] = openSince;
        
        json["ratings"]["food"] = ratings.food;
        json["ratings"]["taste"] = ratings.taste;
        json["ratings"]["ambiance"] = ratings.ambiance;
        json["ratings"]["creativity"] = ratings.creativity;
        json["ratings"]["uniqueness"] = ratings.uniqueness;
        json["ratings"]["overall"] = ratings.overall();
        
        Json::Value awardsArray(Json::arrayValue);
        for (const auto& award : awards) {
            awardsArray.append(award);
        }
        json["awards"] = awardsArray;
        
        Json::Value highlightsArray(Json::arrayValue);
        for (const auto& highlight : highlights) {
            highlightsArray.append(highlight);
        }
        json["highlights"] = highlightsArray;
        
        return json;
    }
};

// In-memory database (in production, use actual database)
class RestaurantDB {
private:
    vector<Restaurant> restaurants;
    
public:
    RestaurantDB() {
        initializeData();
    }
    
    void initializeData() {
        // Sample high-quality restaurant data
        restaurants = {
            {
                1,
                "Le Bernardin",
                "French Seafood",
                "New York, NY",
                "$$$$",
                "Elegant seafood haven serving exquisite French cuisine with unparalleled freshness.",
                1986,
                {4.9, 5.0, 4.8, 4.9, 5.0},
                {"Michelin 3-Star", "James Beard Award"},
                {"Fresh seafood", "Elegant atmosphere", "World-class service"}
            },
            {
                2,
                "Noma",
                "Nordic",
                "Copenhagen, Denmark",
                "$$$$",
                "Revolutionary Nordic cuisine pushing boundaries of modern gastronomy.",
                2003,
                {5.0, 5.0, 4.9, 5.0, 5.0},
                {"Michelin 2-Star", "World's Best Restaurant"},
                {"Innovative", "Foraged ingredients", "Unique experience"}
            },
            {
                3,
                "Osteria Francescana",
                "Italian",
                "Modena, Italy",
                "$$$$",
                "Contemporary Italian masterpiece blending tradition with avant-garde techniques.",
                1995,
                {5.0, 4.9, 4.8, 5.0, 5.0},
                {"Michelin 3-Star", "World's Best Restaurant 2016"},
                {"Creative", "Art on a plate", "Exceptional"}
            }
        };
    }
    
    vector<Restaurant> getAllRestaurants() const {
        return restaurants;
    }
    
    Restaurant* getRestaurantById(int id) {
        auto it = find_if(restaurants.begin(), restaurants.end(),
            [id](const Restaurant& r) { return r.id == id; });
        return it != restaurants.end() ? &(*it) : nullptr;
    }
    
    vector<Restaurant> getTopRated(double minRating = 4.5) const {
        vector<Restaurant> result;
        copy_if(restaurants.begin(), restaurants.end(), back_inserter(result),
            [minRating](const Restaurant& r) { return r.ratings.overall() >= minRating; });
        return result;
    }
    
    vector<Restaurant> searchByCuisine(const string& cuisine) const {
        vector<Restaurant> result;
        copy_if(restaurants.begin(), restaurants.end(), back_inserter(result),
            [&cuisine](const Restaurant& r) { 
                return r.cuisine.find(cuisine) != string::npos; 
            });
        return result;
    }
};

int main() {
    crow::SimpleApp app;
    RestaurantDB db;
    
    // Enable CORS
    CROW_ROUTE(app, "/").methods("OPTIONS"_method)
    ([](){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        return res;
    });
    
    // Health check endpoint
    CROW_ROUTE(app, "/api/health")
    ([](){
        Json::Value response;
        response["status"] = "ok";
        response["message"] = "Foxy Confidential C++ API Server";
        response["timestamp"] = static_cast<long>(time(nullptr));
        
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        res.write(Json::FastWriter().write(response));
        return res;
    });
    
    // Get all restaurants
    CROW_ROUTE(app, "/api/restaurants")
    ([&db](){
        auto restaurants = db.getAllRestaurants();
        Json::Value response(Json::arrayValue);
        
        for (const auto& restaurant : restaurants) {
            response.append(restaurant.toJson());
        }
        
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        res.write(Json::FastWriter().write(response));
        return res;
    });
    
    // Get restaurant by ID
    CROW_ROUTE(app, "/api/restaurants/<int>")
    ([&db](int id){
        auto* restaurant = db.getRestaurantById(id);
        
        if (restaurant) {
            Json::Value response = restaurant->toJson();
            crow::response res;
            res.add_header("Access-Control-Allow-Origin", "*");
            res.add_header("Content-Type", "application/json");
            res.write(Json::FastWriter().write(response));
            return res;
        } else {
            crow::response res(404);
            res.add_header("Access-Control-Allow-Origin", "*");
            res.add_header("Content-Type", "application/json");
            Json::Value error;
            error["error"] = "Restaurant not found";
            res.write(Json::FastWriter().write(error));
            return res;
        }
    });
    
    // Get top-rated restaurants
    CROW_ROUTE(app, "/api/restaurants/top-rated")
    ([&db](){
        auto restaurants = db.getTopRated(4.5);
        Json::Value response(Json::arrayValue);
        
        for (const auto& restaurant : restaurants) {
            response.append(restaurant.toJson());
        }
        
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        res.write(Json::FastWriter().write(response));
        return res;
    });
    
    // Search by cuisine
    CROW_ROUTE(app, "/api/restaurants/cuisine/<string>")
    ([&db](string cuisine){
        auto restaurants = db.searchByCuisine(cuisine);
        Json::Value response(Json::arrayValue);
        
        for (const auto& restaurant : restaurants) {
            response.append(restaurant.toJson());
        }
        
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        res.write(Json::FastWriter().write(response));
        return res;
    });
    
    cout << "🦊 Foxy Confidential C++ API Server starting..." << endl;
    cout << "Server running on http://localhost:8080" << endl;
    cout << "API endpoints:" << endl;
    cout << "  GET  /api/health" << endl;
    cout << "  GET  /api/restaurants" << endl;
    cout << "  GET  /api/restaurants/:id" << endl;
    cout << "  GET  /api/restaurants/top-rated" << endl;
    cout << "  GET  /api/restaurants/cuisine/:cuisine" << endl;
    
    app.port(8080).multithreaded().run();
    
    return 0;
}
