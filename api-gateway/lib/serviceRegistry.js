import { RouteMapping } from '../model/mapping.js';

// Load the service registry
export async function loadServiceRegistry() {
  
  // Query the database
  const rows = await RouteMapping.findAll();

  // Build the registry
  const registry = {};
  
  rows.forEach(row => {
    registry[row.dataValues.route_prefix] = {
      url: row.dataValues.target_url,
      time: row.dataValues.time_window,
      limit: row.dataValues.max_requests,
    };
  });

  return registry;
}
