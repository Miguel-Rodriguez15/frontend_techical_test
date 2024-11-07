export interface Students {
  id:        string;
  email:     string;
  fullName:  string;
  document:  string;
  isActive:  boolean;
  grade:     string;
  classroom: string;
}

export interface Test {
  id:   string;
  name: string;
  year: number;
}

export interface Question {
  id:     string;
  answer: string;
  order:  number;
}
