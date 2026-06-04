const path = require('path');
const fs = require('fs');

const menuPath = path.join(__dirname, '../database/menu.json');

async function getMenuItems(req, res) {
  try {
    const rawData = fs.readFileSync(menuPath, 'utf8');
    const menuItems = JSON.parse(rawData);
    console.log(`Fetched ${menuItems.length} active menu items from menu.json.`);
    return res.json(menuItems);
  } catch (error) {
    console.error('❌ Fetch menu error:', error.message);
    return res.status(500).json({ message: 'Error loading menu items.', items: [] });
  }
}

module.exports = { getMenuItems };
