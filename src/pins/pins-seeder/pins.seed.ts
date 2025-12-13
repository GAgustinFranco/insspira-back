import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from '../entities/pins.entity';
import { Category } from '../../categories/category.entity';
import { User } from '../../users/entities/user.entity';
import { Hashtag } from '../entities/hashtag.entity';

@Injectable()
export class PinsSeeder {
  constructor(
    @InjectRepository(Pin)
    private readonly pinRepo: Repository<Pin>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Hashtag)
    private readonly hashtagRepo: Repository<Hashtag>,
  ) {}

  async seed() {
    // Si ya existen pins seed, NO volver a ejecutar
    const existingPins = await this.pinRepo.count({
      where: { user: { email: 'demo@system.com' } }
    });

    if (existingPins > 0) {
      console.log("⏭ Seed skipped: already seeded.");
      return;
    }
    // Verificar o crear usuario de ejemplo
    let fakeUser = await this.userRepo.findOne({
      where: { email: 'demo@system.com' },
    });

    if (!fakeUser) {
      fakeUser = this.userRepo.create({
        name: 'Demo User',
        email: 'demo@system.com',
        password: 'temporary-password',
        username: 'demo_user',
        pinsCount: 0,
      });
      await this.userRepo.save(fakeUser);
      console.log('👤 Fake user created:', fakeUser.id);
    }

    // Crear categorías base si no existen
    const categories = await this.createCategories();

    // Pre-cargar pines
    await this.createPins(fakeUser, categories);
  }

  private async createCategories() {
    const baseCategories = [
      "Digital Art", // 0
      "Photography", // 1
      "Architecture", // 2
      "Creative", // 3
      "Tech", // 4
    ];
    const categories: Category[] = [];

    for (const name of baseCategories) {
      let cat = await this.categoryRepo.findOne({ where: { name } });
      if (!cat) {
        cat = this.categoryRepo.create({ name });
        await this.categoryRepo.save(cat);
        console.log('📁 Created category:', name);
      }
      categories.push(cat);
    }

    return categories;
  }

  private async createPins(fakeUser: User, categories: Category[]) {
    const pinsData = [
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563391/a43cf6eb8beab1e5bdb2f9650274be59_kcvkvg.jpg",
        description: "Soft neon illustration with futuristic vibes. Perfect blend of color and atmosphere.",
        category: categories[0], // Digital Art
        hashtags: ["digitalart", "neonvibes", "futuristic", "illustration"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563393/ae3861ab9764da070287b985157f573e_gabjqd.jpg",
        description: "Fotografía artística capturando luz y textura con mucha profundidad.",
        category: categories[1], // Photography
        hashtags: ["fotografia", "artphoto", "creativecapture"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563393/ba2685dc712087481ed3467663a91e13_mt4rka.jpg",
        description: "Elegant modern architecture with strong geometric balance.",
        category: categories[2], // Architecture
        hashtags: ["architecture", "modernDesign", "geometry"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563391/61980de837d1b13f3c4c98d793427ae0_asghlp.jpg",
        description: "Paisaje digital con luz dorada, lleno de atmósfera y calma.",
        category: categories[0],
        hashtags: ["digitalpainting", "landscapeart", "goldenlight"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563391/6f3217d9e1c4cfc489ae389f513fdebf_ayhbuv.jpg",
        description: "Creative portrait with surreal elements and unique expressiveness.",
        category: categories[3], // Creative
        hashtags: ["creativeart", "surrealportrait", "artinspiration"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563391/84dce8680cf0048ff8580c02e7940f47_ywsd7d.jpg",
        description: "Street photography with cinematic framing.",
        category: categories[1],
        hashtags: ["streetphotography", "cinematiclook"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/5a63db2869f5292f125e11d130fee041_iey3zy.jpg",
        description: "Ilustración digital de estilo suave y expresivo.",
        category: categories[0],
        hashtags: ["arteDigital", "#oftstyle", "illustracion"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/004f7cb2f1664847ef214c8c8886afc8_for0uh.jpg",
        description: "Abstract tech shapes blending organic and digital aesthetics.",
        category: categories[4],
        hashtags: ["techart", "abstractdesign", "futuristic"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/5cf06580287a414ae43be3a4a9777699_kxyt0i.jpg",
        description: "Arquitectura minimalista con líneas limpias y colores fríos.",
        category: categories[2],
        hashtags: ["arquitectura", "minimalism", "designlover"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/52c6ce5f904c56ac691147c623b1a76f_rxfqsv.jpg",
        description: "Creative visual experiment playing with shapes and color.",
        category: categories[3],
        hashtags: ["creativity", "visualart", "colorstudy"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/39b578aab6d89b49604adf8bc34b735c_v4tx7m.jpg",
        description: "Digital concept art with dramatic lighting.",
        category: categories[0],
        hashtags: ["conceptart", "lightingstudy", "digitalillustration"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/2cdd48c5c00cfef626cd67ddee3db40e_pxcvsf.jpg",
        description: "Fotografía natural con colores vibrantes y enfoque artístico.",
        category: categories[1],
        hashtags: ["naturephoto", "vibrantcolors", "fotografiArte"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/0bcf6112d3307da7c2d1cb4dbf77b0d0_s6ndnn.jpg",
        description: "Creative illustration mixing fantasy and realism.",
        category: categories[3],
        hashtags: ["fantasyart", "creativeillustration"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563389/3c18a4208a752cd581c37f9a2cb0e9e2_rvzqyd.jpg",
        description: "Portrait photography with warm tones and soft depth.",
        category: categories[1],
        hashtags: ["portrait", "warmtones", "photoart"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563390/1f87b29a2df46100a75aa86b170a21cb_pl1kom.jpg",
        description: "Illustration exploring surreal lighting and bold shading.",
        category: categories[0],
        hashtags: ["digitalart", "surreal", "lightingstudy"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563391/631a30048cb87ef49e0e09a672733a83_qxdmpu.jpg",
        description: "Arquitectura moderna con simetría perfecta.",
        category: categories[2],
        hashtags: ["architecturelovers", "symmetry", "modernbuildings"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563391/17014c04001183710f8165962f783a72_rfdcva.jpg",
        description: "Creative minimal piece expressing calm through composition.",
        category: categories[3],
        hashtags: ["minimalart", "creativecomposition"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563393/b6f7f3c446c9c6b87e96db7b26f707e1_dygqz1.jpg",
        description: "Tech-inspired shapes with metallic tones.",
        category: categories[4],
        hashtags: ["techdesign", "metallic", "futuristicart"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563393/e646a543565ccc8e781f24020a2d8a39_xoyyns.jpg",
        description: "Night photography capturing mood and contrast.",
        category: categories[1],
        hashtags: ["nightphoto", "contrast", "urbanmood"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563394/edfe76400d541662d057aece50b0a529_rlldqr.jpg",
        description: "Creative abstract shapes flowing with color.",
        category: categories[3],
        hashtags: ["abstractart", "creativeflow", "colorpalette"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563943/48fc9d608a5cabe5c354a77fbf83f65b_fm2gvq.jpg",
        description: "Digital character concept with expressive pose.",
        category: categories[0],
        hashtags: ["characterdesign", "conceptart", "digitalart"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563936/f768b0a3d0deaff6fae1aeca2420694d_qkhc5r.jpg",
        description: "Fotografía arquitectónica minimalista.",
        category: categories[2],
        hashtags: ["architecturephoto", "minimalismo", "estructuras"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563949/7a36bbea08ee1d2fe3b4b4fe19bc6f08_kmsyzt.jpg",
        description: "Creative splash of color and form.",
        category: categories[3],
        hashtags: ["artcreative", "colorboom"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563389/0fd6cd63e885e81178a6d0d951f2adc5_xnugxr.jpg",
        description: "Cyberpunk tech aesthetic with glowing accents.",
        category: categories[4],
        hashtags: ["cyberpunk", "techvibes", "digitalworld"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563543/paisajetest2_xscxop.jpg",
        description: "Paisaje con tonos fríos y ambiente sereno.",
        category: categories[1],
        hashtags: ["paisaje", "naturaleza", "photoart"],
      },
      {
        image: "https://res.cloudinary.com/dlfhh5uip/image/upload/v1765563394/descarga_mbnta7.png",
        description: "Abstract futuristic interface design.",
        category: categories[4],
        hashtags: ["UIconcept", "futureTech", "designinspiration"],
      },
    ];

    const daysAgoBase = 365; 
    let idx = 0;
  
    for (const entry of pinsData) {
      const hashtagEntities: Hashtag[] = [];
  
      for (const tag of entry.hashtags) {
        let existing = await this.hashtagRepo.findOne({
          where: { tag: tag.toLowerCase() },
        });
  
        if (!existing) {
          existing = this.hashtagRepo.create({ tag: tag.toLowerCase() });
          await this.hashtagRepo.save(existing);
        }
  
        hashtagEntities.push(existing);
      }
  
      // crear pin
      const pin = this.pinRepo.create({
        image: entry.image,
        description: entry.description,
        category: entry.category,
        user: fakeUser,
        hashtags: hashtagEntities,
      });
  
      // hace que cada pin del seed sea más viejo que el anterior
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - (daysAgoBase + idx));
      (pin as any).createdAt = createdAt;
  
      idx++; // avanzar al siguiente pin
  
      await this.pinRepo.save(pin);
      await this.userRepo.increment({ id: fakeUser.id }, 'pinsCount', 1);
  
      console.log(`✔ Pin created: ${pin.description}`);
    }
  
    console.log('🌱 PIN seeding completed.');
  }
}




