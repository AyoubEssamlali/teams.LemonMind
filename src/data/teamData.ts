import { TeamMember } from '../types';
export type { TeamMember };

/* =========================================================
   LemonMind Agency — Team Data (Single Source of Truth)
   
   HOW TO ADD A NEW TEAM MEMBER (e.g. 6th or 7th member):
   1. Place their portrait photo in public/photos/<slug>.<ext>
   2. Append a new object to TEAM_MEMBERS below.
   3. Assign an incremented `order` (e.g. 6, 7).
   4. The homepage grid automatically adapts to 3 columns
      when 6 or more non-featured members are present.
   ========================================================= */

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'amal-amazouz',
    firstName: 'Amal',
    lastName: 'AMAZOUZ',
    jobTitle: 'Direction',
    profession: 'Chief Digital Officer',
    phone: '+212661768009',
    phoneLink: '+212661768009',
    email: 'Amal@lemonmind.agency',
    slug: 'amal-amazouz',
    order: 1,
    featured: true,
    photo: '/photos/amal-amazouz.webp'
  },
  {
    id: 'elhoussine-essmami',
    firstName: 'Elhoussine',
    lastName: 'ESSMAMI',
    jobTitle: 'Strategic Planner',
    profession: 'Strategic Planner',
    phone: '+212679110749',
    phoneLink: '+212679110749',
    email: 'elhoussine@lemonmind.agency',
    slug: 'elhoussine-essmami',
    order: 2,
    featured: true,
    photo: '/photos/elhoussine-essmami.webp'
  },
  {
    id: 'salah-eddine-mimouni',
    firstName: 'Salah-Eddine',
    lastName: 'MIMOUNI',
    jobTitle: 'Direction',
    profession: 'CEO & CTO',
    phone: '+212661172885',
    phoneLink: '+212661172885',
    email: 'salah@lemonmind.agency',
    slug: 'salah-eddine-mimouni',
    order: 3,
    featured: true,
    photo: '/photos/salah-eddine-mimouni.webp'
  },
  {
    id: 'tarik-el-abbadi',
    firstName: 'Tarik',
    lastName: 'EL ABBADI',
    jobTitle: 'Direction',
    profession: 'Com & Event Director',
    phone: '+212707000300',
    phoneLink: '+212707000300',
    email: 'tarik@lemonmind.agency',
    slug: 'tarik-el-abbadi',
    order: 4,
    featured: true,
    photo: '/photos/tarik-el-abbadi.webp'
  },
  {
    id: 'ayoub-es-samlali',
    firstName: 'Ayoub',
    lastName: 'ES-SAMLALI',
    jobTitle: 'Gestion de projet',
    profession: 'Digital Project Manager',
    phone: '+212641473756',
    phoneLink: '+212641473756',
    email: 'Ayoub@lemonmind.agency',
    slug: 'ayoub-es-samlali',
    order: 5,
    featured: false,
    photo: '/photos/ayoub-es-samlali.webp'
  },
  {
    id: 'yassmine-boudial',
    firstName: 'Yassmine',
    lastName: 'BOUDIAL',
    jobTitle: 'Gestion de projet',
    profession: 'Digital Project Manager',
    phone: '+212626162594',
    phoneLink: '+212626162594',
    email: 'Yassmine@lemonmind.agency',
    slug: 'yassmine-boudial',
    order: 6,
    featured: false,
    photo: '/photos/yassmine-boudial.webp'
  },
  {
    id: 'wafae-lamsabni',
    firstName: 'Wafae',
    lastName: 'LAMSABNI',
    jobTitle: 'Gestion de projet',
    profession: 'Digital Project Manager',
    phone: '+212689913659',
    phoneLink: '+212689913659',
    email: 'Wafae@lemonmind.agency',
    slug: 'wafae-lamsabni',
    order: 7,
    featured: false,
    photo: '/photos/wafae-lamsabni.webp'
  },
  {
    id: 'zakaria-mouchtati',
    firstName: 'Zakaria',
    lastName: 'MOUCHTATI',
    jobTitle: 'Développement',
    profession: 'Senior Full Stack Developer',
    phone: '+212621586010',
    phoneLink: '+212621586010',
    email: 'Zakaria@lemonmind.agency',
    slug: 'zakaria-mouchtati',
    order: 8,
    featured: false,
    photo: '/photos/zakaria-mouchtati.webp'
  },
  {
    id: 'youssef-amazouz',
    firstName: 'Youssef',
    lastName: 'AMAZOUZ',
    jobTitle: 'Design',
    profession: 'Graphic Design Finalizer',
    phone: '+212771550844',
    phoneLink: '+212771550844',
    email: 'Youssef@lemonmind.agency',
    slug: 'youssef-amazouz',
    order: 9,
    featured: false,
    photo: '/photos/youssef-amazouz.webp'
  }
];

export function getFullName(member: TeamMember): string {
  return `${member.firstName} ${member.lastName}`;
}

export function getFeaturedMembers(): TeamMember[] {
  return TEAM_MEMBERS
    .filter((m) => m.featured)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedMember(): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.featured);
}

export function getGridMembers(): TeamMember[] {
  return TEAM_MEMBERS
    .filter((m) => !m.featured)
    .sort((a, b) => a.order - b.order);
}

export function getMemberBySlug(slug: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.slug.toLowerCase() === slug.toLowerCase());
}
