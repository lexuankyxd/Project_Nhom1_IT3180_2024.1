#include <iostream>
#include <pqxx/pqxx>

using namespace std;
using namespace pqxx;

int main() {
  try {
    // Connect to the database
    connection c("dbname=panc user=postgres password=admin "
                 "host=127.0.0.1 port=5432");

    if (c.is_open()) {
      cout << "Opened database successfully: " << c.dbname() << endl;
    } else {
      cout << "Can't open database" << endl;
      return 1;
    }

    // Start a transaction
    work w(c);

    // Create a table
    w.exec("CREATE TABLE IF NOT EXISTS cities (name VARCHAR(80), location "
           "POINT, population INT);");

    // Insert data into the table
    w.exec("INSERT INTO cities VALUES ('Canberra', '(35.3, 149.1)', 395790);");

    // Commit the transaction
    w.commit();

    // Query the table
    nontransaction n(c);
    result r = n.exec("SELECT * FROM cities;");

    // Display results
    for (auto row : r) {
      cout << "Name: " << row[0].as<string>()
           << ", Location: " << row[1].as<string>()
           << ", Population: " << row[2].as<int>() << endl;
    }

    // Close the connection
  } catch (const exception &e) {
    cerr << e.what() << endl;
    return 1;
  }

  return 0;
}
