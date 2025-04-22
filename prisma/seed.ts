import { PrismaClient, Domain } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";

const prisma = new PrismaClient();

const NUM_USERS = 1000; // Number of users to generate

const domains: Domain[] = [
  Domain.BACKEND,
  Domain.FRONTEND,
  Domain.DESIGNING,
  Domain.DEVOPS,
  Domain.DATA_SCIENCE,
  Domain.MOBILE,
  Domain.QA,
  Domain.OTHER,
];

const allSkills = [
  "React",
  "Node.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Java",
  "Ruby",
  "PHP",
  "C#",
  "Swift",
  "Kotlin",
  "SQL",
  "NoSQL",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Terraform",
  "Figma",
  "Sketch",
  "Adobe XD",
  "UI Design",
  "UX Research",
  "Product Management",
  "Agile",
  "Scrum",
  "Data Analysis",
  "Machine Learning",
  "AI",
  "iOS Development",
  "Android Development",
  "Vue.js",
  "Angular",
  "Svelte",
  "Next.js",
  "NestJS",
  "Django",
  "Flask",
  "Express.js",
  "GraphQL",
  "REST API Design",
  "CI/CD",
  "Automated Testing",
  "Manual Testing",
];

const allGoals = [
  "Build SaaS",
  "Find Co-Founder",
  "Learn New Tech",
  "Build Portfolio Project",
  "Contribute to Open Source",
  "Network with Developers",
  "Find Mentorship",
  "Mentor Others",
  "Explore AI Tools",
  "Work on Side Projects",
  "Get Beta Testers",
  "Improve UX Skills",
  "Optimize Backend Performance",
  "Develop Mobile App",
];

function getRandomSubset<T>(arr: T[], maxSize: number): T[] {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  const size = Math.floor(Math.random() * (maxSize + 1)); // 0 to maxSize
  return shuffled.slice(0, size);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function writeusersInJson() {
  const users = await prisma.user.findMany();
  writeFileSync("all_users.json", JSON.stringify(users, null, 2));
  console.log("✅ All users written to all_users.json");
}

/**
 * npx prisma db seed
 */
async function main() {
  //   await writeusersInJson();
  //   return;
  console.log(`Start seeding ...`);

  // Clear existing data (optional, use with caution!)
  // console.log('Deleting existing users and connections...');
  // await prisma.connection.deleteMany();
  // await prisma.user.deleteMany(); // Requires cascade delete setup or deleting related records first
  // console.log('Existing data deleted.');

  const usersToCreate = [];

  for (let i = 0; i < NUM_USERS; i++) {
    const name = faker.person.fullName();
    const email = faker.internet
      .email({
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        provider: `seed${i}.example.com`,
      })
      .toLowerCase(); // Ensure unique emails for seeding
    const domain = faker.helpers.arrayElement(domains);
    const skills = getRandomSubset(allSkills, 5); // Max 5 skills
    const learning = getRandomSubset(
      allSkills.filter((skill) => !skills.includes(skill)),
      3
    ); // Max 3 learning, not overlapping with skills
    const goals = getRandomSubset(allGoals, 3); // Max 3 goals
    const availability = faker.number.int({ min: 1, max: 20 }); // 1-20 hrs/week
    const image = faker.image.avatar();

    usersToCreate.push({
      name,
      email,
      emailVerified: faker.date.past(), // Assume verified for simplicity
      image,
      domain,
      skills,
      learning,
      goals,
      availability,
    });
  }

  console.log(`Creating ${usersToCreate.length} users...`);
  // Prisma's createMany is more efficient for large inserts but doesn't support certain relations/defaults well sometimes.
  // Using individual creates in a loop or $transaction might be necessary if createMany fails.
  // For PostgreSQL, createMany should work fine here.
  try {
    await prisma.user.createMany({
      data: usersToCreate,
      skipDuplicates: true, // Skip if an email constraint violation occurs (though we try to make them unique)
    });
    console.log(`Seeding finished: ${NUM_USERS} users created.`);
  } catch (error) {
    console.error("Error during user creation:", error);
    // Fallback to individual creates if createMany fails (e.g., due to specific DB constraints or features)
    // console.log("Attempting individual user creation...");
    // let createdCount = 0;
    // for (const userData of usersToCreate) {
    //     try {
    //         await prisma.user.create({ data: userData });
    //         createdCount++;
    //     } catch (e: any) {
    //         console.warn(`Could not create user ${userData.email}: ${e.message}`);
    //     }
    // }
    // console.log(`Seeding finished: ${createdCount} users created individually.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
