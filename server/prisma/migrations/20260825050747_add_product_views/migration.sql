-- CreateTable
CREATE TABLE "public"."ProductView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductView_userId_viewedAt_idx" ON "public"."ProductView"("userId", "viewedAt");

-- CreateIndex
CREATE INDEX "ProductView_productId_idx" ON "public"."ProductView"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductView_userId_productId_key" ON "public"."ProductView"("userId", "productId");

-- AddForeignKey
ALTER TABLE "public"."ProductView" ADD CONSTRAINT "ProductView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductView" ADD CONSTRAINT "ProductView_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
