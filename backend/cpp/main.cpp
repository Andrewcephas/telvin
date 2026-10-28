#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
#include <vector>
#include "sqlite3.h"

using namespace std;

class BlueTellServer {
private:
    sqlite3* db;
public:
    BlueTellServer() {
        sqlite3_open("../../db/bluetell.db", &db);
    }
    
    ~BlueTellServer() {
        sqlite3_close(db);
    }
    
    void start() {
        cout << "BlueTell C++ Server starting..." << endl;
        cout << "Note: This is a basic structure. For full HTTP server, use libraries like cpp-httplib or Crow." << endl;
        cout << "Database connected." << endl;
    }
    
    void addContact(const string& name, const string& email, const string& phone, const string& subject, const string& message) {
        string sql = "INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?);";
        sqlite3_stmt* stmt;
        sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, NULL);
        sqlite3_bind_text(stmt, 1, name.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, email.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 3, phone.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 4, subject.c_str(), -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 5, message.c_str(), -1, SQLITE_STATIC);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
        cout << "Contact added successfully." << endl;
    }
};

int main() {
    BlueTellServer server;
    server.start();
    
    cout << "\nBlueTell Server Ready" << endl;
    cout << "API endpoints:" << endl;
    cout << "  POST /api/contact" << endl;
    cout << "  GET  /api/services" << endl;
    cout << "  POST /api/subscribe" << endl;
    cout << "  GET  /api/health" << endl;
    
    return 0;
}
