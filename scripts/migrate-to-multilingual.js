const { MongoClient } = require('mongodb');

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taj-house-dashboard';
const DB_NAME = process.env.DB_NAME || 'taj-house-dashboard';

async function migrateToMultilingual() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Migrate Categories
    console.log('Migrating categories...');
    const categoriesCollection = db.collection('categories');
    const categories = await categoriesCollection.find({}).toArray();

    for (const category of categories) {
      // Check if already migrated
      if (typeof category.name === 'object' && category.name.en && category.name.ar) {
        console.log(`Category ${category._id} already migrated`);
        continue;
      }

      // Migrate name
      const migratedName = {
        en: category.name || '',
        ar: category.name || ''
      };

      // Migrate description
      const migratedDescription = category.description ? {
        en: category.description,
        ar: category.description
      } : undefined;

      await categoriesCollection.updateOne(
        { _id: category._id },
        {
          $set: {
            name: migratedName,
            ...(migratedDescription && { description: migratedDescription })
          }
        }
      );

      console.log(`Migrated category: ${category._id}`);
    }

    // Migrate Projects
    console.log('Migrating projects...');
    const projectsCollection = db.collection('projects');
    const projects = await projectsCollection.find({}).toArray();

    for (const project of projects) {
      // Check if already migrated
      if (typeof project.title === 'object' && project.title.en && project.title.ar) {
        console.log(`Project ${project._id} already migrated`);
        continue;
      }

      // Migrate title
      const migratedTitle = {
        en: project.title || '',
        ar: project.title || ''
      };

      // Migrate description
      const migratedDescription = project.description ? {
        en: project.description,
        ar: project.description
      } : undefined;

      await projectsCollection.updateOne(
        { _id: project._id },
        {
          $set: {
            title: migratedTitle,
            ...(migratedDescription && { description: migratedDescription })
          }
        }
      );

      console.log(`Migrated project: ${project._id}`);
    }

    console.log('Migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToMultilingual();
}

module.exports = { migrateToMultilingual };
