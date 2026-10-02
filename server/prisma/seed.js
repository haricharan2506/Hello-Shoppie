const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    name: "Electronics",
    description:
      "Mobiles, laptops, computers, accessories, and electronic devices.",
  },
  {
    name: "Fashion",
    description:
      "Clothing, footwear, bags, and fashion accessories.",
  },
  {
    name: "Beauty & Personal Care",
    description:
      "Beauty products, skincare, haircare, and personal care items.",
  },
  {
    name: "Home & Kitchen",
    description:
      "Furniture, kitchen appliances, cookware, and home essentials.",
  },
  {
    name: "Grocery",
    description:
      "Food, beverages, packaged products, and everyday grocery items.",
  },
  {
    name: "Sports & Fitness",
    description:
      "Sports equipment, fitness accessories, and outdoor products.",
  },
  {
    name: "Books",
    description:
      "Books, educational materials, novels, and study resources.",
  },
  {
    name: "Toys & Games",
    description:
      "Toys, board games, puzzles, and entertainment products.",
  },
  {
    name: "Jewelry & Accessories",
    description:
      "Jewelry, watches, and fashion accessories.",
  },
  {
    name: "Health & Wellness",
    description:
      "Health, wellness, and general healthcare products.",
  },
];

async function main() {
  console.log("Adding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        name: category.name,
      },
      update: {
        description: category.description,
      },
      create: category,
    });
  }

  console.log("Categories added successfully.");
}

main()
  .catch((error) => {
    console.error("CATEGORY SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });