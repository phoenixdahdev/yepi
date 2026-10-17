import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { currentDraftId } from "../../_lib/draft-session";

const MAX_DECK_BYTES = 20 * 1024 * 1024;
const MAX_SUPPORTING_BYTES = 10 * 1024 * 1024;

const DECK_TYPES = ["application/pdf"];
const SUPPORTING_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

/**
 * Issues short-lived client upload tokens. Pitch decks exceed the 4.5 MB
 * function body limit, so the file goes straight from the browser to Blob and
 * never through this route — only the token does.
 *
 * The store is public (see file-picker.tsx), so these checks are the only
 * thing standing between the internet and the store: a caller must hold a
 * live draft cookie, may only write inside that draft's own prefix, and is
 * held to a content type and size cap.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Only someone with a live draft may upload, and only inside their
        // own prefix — the client picks the pathname, so it is not trusted.
        const draftId = await currentDraftId();
        if (!draftId) {
          throw new Error("No application in progress.");
        }

        const prefix = `applications/${draftId}/`;
        if (!pathname.startsWith(prefix)) {
          throw new Error("Upload path does not belong to this application.");
        }

        const isDeck = pathname.startsWith(`${prefix}deck/`);

        return {
          allowedContentTypes: isDeck ? DECK_TYPES : SUPPORTING_TYPES,
          maximumSizeInBytes: isDeck ? MAX_DECK_BYTES : MAX_SUPPORTING_BYTES,
          addRandomSuffix: true,
          tokenPayload: draftId,
        };
      },
      onUploadCompleted: async () => {
        // Intentionally empty. This fires from Vercel's webhook and never on
        // localhost, so the draft is updated from the form submission instead.
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[blob-upload]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
