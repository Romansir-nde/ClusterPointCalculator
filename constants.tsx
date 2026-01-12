
import { Grade, Subject, ClusterRequirement } from './types';

export const GRADE_POINTS: Record<Grade, number> = {
  'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 
  'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
};

export const SUBJECTS: Subject[] = [
  { id: 'eng', name: 'English', category: 'compulsory' },
  { id: 'kis', name: 'Kiswahili', category: 'compulsory' },
  { id: 'mat', name: 'Mathematics', category: 'compulsory' },
  { id: 'bio', name: 'Biology', category: 'sciences' },
  { id: 'phy', name: 'Physics', category: 'sciences' },
  { id: 'che', name: 'Chemistry', category: 'sciences' },
  { id: 'his', name: 'History', category: 'humanities' },
  { id: 'geo', name: 'Geography', category: 'humanities' },
  { id: 'cre', name: 'CRE/IRE/HRE', category: 'humanities' },
  { id: 'agr', name: 'Agriculture', category: 'technical' },
  { id: 'bus', name: 'Business Studies', category: 'technical' },
  { id: 'comp', name: 'Computer Studies', category: 'technical' },
  { id: 'home', name: 'Home Science', category: 'technical' },
  { id: 'art', name: 'Art and Design', category: 'technical' },
  { id: 'fre', name: 'French', category: 'languages' },
  { id: 'ger', name: 'German', category: 'languages' },
  { id: 'mus', name: 'Music', category: 'languages' },
];

export const CLUSTERS: ClusterRequirement[] = [
  { id: 1, name: 'Law & Related', subjects: [['eng'], ['his', 'geo', 'cre'], ['mat', 'bio', 'phy', 'che'], ['eng', 'kis', 'bus', 'his', 'geo', 'cre']] },
  { id: 2, name: 'Business & Related', subjects: [['mat'], ['eng', 'kis'], ['bio', 'phy', 'che', 'his', 'geo', 'cre'], ['bus', 'mat', 'eco']] },
  { id: 3, name: 'Arts & Related', subjects: [['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre'], ['art', 'mus', 'fre', 'ger', 'eng', 'kis']] },
  { id: 4, name: 'GeoScience & Related', subjects: [['mat'], ['phy'], ['che'], ['geo']] },
  { id: 5, name: 'Special Education', subjects: [['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre'], ['bus', 'agr', 'comp']] },
  { id: 6, name: 'Kiswahili & Related', subjects: [['kis'], ['eng'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre']] },
  { id: 7, name: 'Engineering & Technology', subjects: [['mat'], ['phy'], ['che'], ['bio', 'geo', 'bus', 'eng', 'kis']] },
  { id: 8, name: 'Architecture, Design & Planning', subjects: [['mat'], ['phy'], ['eng', 'kis'], ['che', 'bio', 'art', 'geo']] },
  { id: 9, name: 'Computing, IT & Related', subjects: [['mat'], ['phy', 'bio', 'che'], ['eng', 'kis'], ['comp', 'bus', 'geo']] },
  { id: 10, name: 'Agribusiness & Related', subjects: [['mat'], ['bio', 'che'], ['eng', 'kis'], ['bus', 'agr']] },
  { id: 11, name: 'Science & Related', subjects: [['mat'], ['bio'], ['che'], ['phy', 'geo']] },
  { id: 12, name: 'Mathematics, Economics & Related', subjects: [['mat'], ['eng', 'kis'], ['bio', 'phy', 'che'], ['bus', 'mat']] },
  { id: 13, name: 'Design, Textiles & Related', subjects: [['art', 'home'], ['mat', 'bio', 'phy', 'che'], ['eng', 'kis'], ['bus', 'his', 'geo']] },
  { id: 14, name: 'Sports & Physical Education', subjects: [['bio'], ['eng', 'kis'], ['mat', 'phy', 'che'], ['his', 'geo', 'cre', 'bus']] },
  { id: 15, name: 'Medicine, Nursing & Health', subjects: [['bio'], ['che'], ['mat', 'phy'], ['eng', 'kis']] },
  { id: 16, name: 'History & Related', subjects: [['his'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['geo', 'cre', 'bus']] },
  { id: 17, name: 'Agriculture, Food Science & Env', subjects: [['bio'], ['che'], ['mat', 'phy', 'geo'], ['agr', 'bus', 'eng', 'kis']] },
  { id: 18, name: 'Geography & Natural Resources', subjects: [['geo'], ['mat'], ['bio', 'phy', 'che'], ['eng', 'kis', 'bus']] },
  { id: 19, name: 'French & Related', subjects: [['fre'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre']] },
  { id: 20, name: 'German & Related', subjects: [['ger'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre']] },
  { id: 21, name: 'Music & Related', subjects: [['mus'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo', 'cre']] },
  { id: 22, name: 'Education Science & Arts', subjects: [['mat', 'his', 'geo'], ['eng', 'kis'], ['bio', 'phy', 'che'], ['bus', 'cre', 'mat']] },
  { id: 23, name: 'Religious Studies & Related', subjects: [['cre'], ['eng', 'kis'], ['mat', 'bio', 'phy', 'che'], ['his', 'geo']] },
];
