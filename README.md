# quadtree
A quadtree implementation with item removal and updating.

## Example

    let qt = new QT(0, 0, 1000, 1000);
    for (let i = 0; i < 1000; i++) {
      qt.insert({ x: Math.random() * 1000, y: Math.random() * 1000 });
    }

    // Querying items with a range
    let items = [];
    qt.query({ x: 0, y: 0, width: 100, height: 200 }, function(item) {
      items.push(item);
    });

    // Querying with coordinates
    qt.query2(20, 20, function(item) {
      items.push(item);
    });

    // Updating moving items
    let movingItem = { x: 0, y: 0 }
    qt.insert(movingItem);

    movingItem.x += 200;
    updateQtItem(qt, movingItem);

    // Removing
    removeFromQt(movingItem);
