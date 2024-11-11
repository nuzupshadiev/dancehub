export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  profilePicture: string;
  projects: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const sampleUser: User = {
  id: "u001",
  username: "Seyeon Kim",
  email: "tpdus2155@kaist.ac.kr",
  password: "IamDaemaree",
  profilePicture:
    "https://i.namu.wiki/i/PN2qfLBMOxGVYREwy8lQfy0zzzCH68zGTe6nd8fJxIdLF3_pk-chtUy9zWoCnZlY6C3Yf53-DaLbDUyJcyaRku46hShvCgwLr0dMKDPON9D0bi93QlYGDkHbDHl71YBqqiND20SKu5MSeZWH0u6QKPtMP1p8W2ESTeGVeJrfNak.webp",
  projects: ["p001"],
  createdAt: new Date("2024-09-28"),
};
