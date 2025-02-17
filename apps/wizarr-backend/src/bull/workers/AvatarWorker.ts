// // Download each user's avatar
// for (const user of users) {
//     if (user.avatar) {
//         try {
//             // Create the folder for avatars if it doesn't exist
//             if (!fs.existsSync(path.join(env("STORAGE_DIR"), "avatars"))) {
//                 fs.mkdirSync(path.join(env("STORAGE_DIR"), "avatars"), { recursive: true });
//             }

//             job.log(`Downloading avatar for user ${user.id}`);

//             // Remove any existing avatar file
//             if (fs.existsSync(path.join(env("STORAGE_DIR"), "avatars", `avatar_${user.id}.png`))) {
//                 fs.unlinkSync(path.join(env("STORAGE_DIR"), "avatars", `avatar_${user.id}.png`));
//             }

//             // Wait for a short moment to prevent hitting the rate limit on the server
//             await new Promise((resolve) => setTimeout(resolve, 1000));

//             // Check if the server has been deleted
//             // Construct the file path to save the avatar
//             const avatarFilePath = path.join(env("STORAGE_DIR"), "avatars", `avatar_${user.id}.png`);
//             const writer = fs.createWriteStream(avatarFilePath);

//             // Fetch the avatar image and stream it to the file
//             const response = await axios({
//                 method: "get",
//                 url: user.avatar,
//                 responseType: "stream",
//                 onDownloadProgress,
//             });

//             response.data.pipe(writer);

//             // Wait for the file to finish downloading
//             await new Promise((resolve, reject) => {
//                 writer.on("finish", resolve);
//                 writer.on("error", reject);
//             });

//             job.log(`Avatar for user ${user.id} downloaded successfully.`);
//         } catch (error) {
//             job.log(`Failed to download avatar for user ${user.id}: ${error.message}`);
//         }
//     }
// }
