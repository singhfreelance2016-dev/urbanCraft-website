const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Your MongoDB Atlas URI
const uri = "mongodb+srv://singhfreelance2016_db_user:SkillTracker123!@cluster0.gbhn7kw.mongodb.net/urbancraft?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);

async function setupDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas!');
        
        const db = client.db('urbancraft');
        
        console.log('📦 Creating collections and inserting data...\n');

        // ===== 1. SERVICES COLLECTION =====
        console.log('📊 Setting up Services...');
        await db.collection('services').deleteMany({});
        const services = await db.collection('services').insertMany([
            {
                title: 'Residential Design',
                description: 'Transform your home into a personalized sanctuary with our comprehensive residential design services. From concept to completion, we create spaces that reflect your lifestyle.',
                icon: 'fa-home',
                image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
                features: ['Custom Home Design', 'Interior Design', 'Space Planning', 'Material Selection'],
                order: 1,
                active: true,
                createdAt: new Date()
            },
            {
                title: 'Commercial Spaces',
                description: 'Create inspiring workplaces that boost productivity and leave lasting impressions. Our commercial designs balance functionality with aesthetic appeal.',
                icon: 'fa-building',
                image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
                features: ['Office Design', 'Retail Spaces', 'Restaurants', 'Showrooms'],
                order: 2,
                active: true,
                createdAt: new Date()
            },
            {
                title: 'Renovation',
                description: 'Breathe new life into existing spaces with our expert renovation services. We preserve character while modernizing functionality.',
                icon: 'fa-hammer',
                image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a',
                features: ['Kitchen Remodeling', 'Bathroom Renovation', 'Basement Finishing', 'Home Additions'],
                order: 3,
                active: true,
                createdAt: new Date()
            },
            {
                title: 'Interior Design',
                description: 'Expert interior design services that transform empty rooms into beautiful, functional spaces tailored to your taste.',
                icon: 'fa-paint-brush',
                image: 'https://images.unsplash.com/photo-1618221195710-dd0b2e9b38b1',
                features: ['Color Consultation', 'Furniture Selection', 'Lighting Design', 'Accessories'],
                order: 4,
                active: true,
                createdAt: new Date()
            }
        ]);
        console.log(`   ✅ ${services.insertedCount} services created`);

        // ===== 2. GALLERY COLLECTION =====
        console.log('\n📊 Setting up Gallery...');
        await db.collection('galleries').deleteMany({});
        const galleries = await db.collection('galleries').insertMany([
            {
                title: 'Modern Kitchen Renovation',
                category: 'renovation',
                imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
                description: 'Complete kitchen transformation with custom cabinetry and island',
                featured: true,
                order: 1,
                createdAt: new Date()
            },
            {
                title: 'Luxury Bathroom Design',
                category: 'residential',
                imageUrl: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14',
                description: 'Spa-inspired master bathroom with marble finishes',
                featured: true,
                order: 2,
                createdAt: new Date()
            },
            {
                title: 'Contemporary Office Space',
                category: 'commercial',
                imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6a72',
                description: 'Open-plan office with collaborative zones',
                featured: false,
                order: 3,
                createdAt: new Date()
            },
            {
                title: 'Outdoor Living Area',
                category: 'design',
                imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea',
                description: 'Seamless indoor-outdoor transition with covered patio',
                featured: true,
                order: 4,
                createdAt: new Date()
            },
            {
                title: 'Minimalist Living Room',
                category: 'residential',
                imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
                description: 'Clean lines and natural light in modern living space',
                featured: true,
                order: 5,
                createdAt: new Date()
            },
            {
                title: 'Restaurant Interior',
                category: 'commercial',
                imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
                description: 'Warm and inviting restaurant design',
                featured: false,
                order: 6,
                createdAt: new Date()
            }
        ]);
        console.log(`   ✅ ${galleries.insertedCount} gallery items created`);

        // ===== 3. USERS COLLECTION =====
        console.log('\n📊 Setting up Admin User...');
        await db.collection('users').deleteMany({});
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const user = await db.collection('users').insertOne({
            username: 'admin',
            password: hashedPassword,
            createdAt: new Date()
        });
        console.log(`   ✅ Admin user created`);

        // ===== 4. CONTACTS COLLECTION =====
        console.log('\n📊 Setting up Contacts...');
        await db.collection('contacts').deleteMany({});
        const contact = await db.collection('contacts').insertOne({
            name: 'John Smith',
            email: 'john.smith@example.com',
            phone: '(212) 555-0123',
            service: 'residential',
            message: 'Interested in renovating my kitchen. Looking for a consultation.',
            status: 'new',
            createdAt: new Date()
        });
        console.log(`   ✅ Sample contact created`);

        // ===== 5. CREATE INDEXES =====
        console.log('\n🔧 Creating indexes for better performance...');
        await db.collection('services').createIndex({ order: 1 });
        await db.collection('services').createIndex({ active: 1 });
        await db.collection('galleries').createIndex({ category: 1 });
        await db.collection('galleries').createIndex({ featured: -1 });
        await db.collection('contacts').createIndex({ status: 1 });
        await db.collection('contacts').createIndex({ createdAt: -1 });
        await db.collection('users').createIndex({ username: 1 }, { unique: true });
        console.log('   ✅ All indexes created');

        // ===== SUMMARY =====
        console.log('\n' + '='.repeat(50));
        console.log('🎉 DATABASE SETUP COMPLETE!');
        console.log('='.repeat(50));
        console.log('📊 Summary:');
        console.log(`   • Services: ${services.insertedCount} items`);
        console.log(`   • Gallery: ${galleries.insertedCount} items`);
        console.log(`   • Users: 1 admin`);
        console.log(`   • Contacts: 1 sample`);
        console.log('='.repeat(50));
        console.log('🔑 Admin Login:');
        console.log('   Username: admin');
        console.log('   Password: Admin@123');
        console.log('='.repeat(50));
        console.log('⚠️  IMPORTANT: Change password after first login!');
        console.log('='.repeat(50));
        
        // Verify collections
        const collections = await db.listCollections().toArray();
        console.log('\n📁 Collections created:');
        collections.forEach(col => console.log(`   • ${col.name}`));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('\n👋 Database connection closed');
    }
}

// Run the setup
setupDatabase();