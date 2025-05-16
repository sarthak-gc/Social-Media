-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "RelationType" AS ENUM ('FRIENDS', 'UNFRIENDED', 'BLOCKED_BY_SENDER', 'BLOCKED_BY_RECEIVER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('POST', 'REQUEST_SENT', 'REQUEST_ACCEPTED');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pfp" TEXT,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Request" (
    "requestId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Request_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "Relation" (
    "relationId" TEXT NOT NULL,
    "initiator" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "RelationType" NOT NULL,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("relationId")
);

-- CreateTable
CREATE TABLE "Post" (
    "postId" TEXT NOT NULL,
    "posterId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postId")
);

-- CreateTable
CREATE TABLE "Image" (
    "imageId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "creatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Request_requestId_key" ON "Request"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_relationId_key" ON "Relation"("relationId");

-- CreateIndex
CREATE UNIQUE INDEX "Relation_initiator_receiver_key" ON "Relation"("initiator", "receiver");

-- CreateIndex
CREATE UNIQUE INDEX "Post_postId_key" ON "Post"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_imageId_key" ON "Image"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_notificationId_key" ON "Notification"("notificationId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_initiator_fkey" FOREIGN KEY ("initiator") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_posterId_fkey" FOREIGN KEY ("posterId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
