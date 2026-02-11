-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clutchUrl" TEXT,
    "websiteUrl" TEXT,
    "logoUrl" TEXT,
    "description" TEXT NOT NULL,
    "longDescription" TEXT,
    "clutchRating" DOUBLE PRECISION,
    "reviewCount" INTEGER,
    "minProjectSize" TEXT,
    "avgHourlyRate" TEXT,
    "teamSize" TEXT,
    "founded" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "services" TEXT[],
    "industries" TEXT[],
    "notableClients" TEXT[],
    "specialties" TEXT[],
    "tagline" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "introContent" TEXT NOT NULL,
    "methodContent" TEXT NOT NULL,
    "guideContent" TEXT NOT NULL,
    "conclusionContent" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "readingTime" INTEGER NOT NULL DEFAULT 8,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogAgencyEntry" (
    "id" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "whyChoose" TEXT NOT NULL,
    "knownFor" TEXT NOT NULL,
    "blogPostId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "BlogAgencyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "population" INTEGER,
    "techScene" TEXT,
    "industries" TEXT[],
    "landmarks" TEXT[],

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_slug_key" ON "Agency"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogAgencyEntry_blogPostId_agencyId_key" ON "BlogAgencyEntry"("blogPostId", "agencyId");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- AddForeignKey
ALTER TABLE "BlogAgencyEntry" ADD CONSTRAINT "BlogAgencyEntry_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogAgencyEntry" ADD CONSTRAINT "BlogAgencyEntry_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
