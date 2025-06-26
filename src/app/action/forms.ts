'use server';

import { connectToDB, disconnectFromDB } from '@/lib/mongodb';
import { auth } from '../../../auth';
import { Form } from '@/lib/interface';

// Ensures a form exists by form_ID
export async function createFormIfNotExists(form_ID: string, name?: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    let userID = 'anonymous';

    if (session?.user?.email) {
      const userDoc = await db
        .collection('user')
        .findOne({ email: session.user.email });
      if (userDoc && userDoc.user_ID) {
        userID = userDoc.user_ID;
      }
    }

    const collection = db.collection('forms');

    const existing = await collection.findOne({ form_ID });
    if (!existing) {
      const newForm: Form = {
        form_ID,
        title: name || 'Untitled Form', 
        description: '',
        createdAt: new Date(),
        createdBy: userID,
        version: 1.0,
        sections: [],
      };

      await collection.insertOne(newForm);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error('❌ Create Form Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ✅ Fetch all forms created by the logged-in user
export async function getFormsForUser() {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    if (!session?.user?.email) return [];

    const userDoc = await db
      .collection('user')
      .findOne({ email: session.user.email });
    const userID = userDoc?.user_ID || 'anonymous';

    const forms = await db
      .collection('forms')
      .find({ createdBy: userID })
      .toArray();

    await disconnectFromDB(dbClient);

    // 🔄 Convert MongoDB objects to plain JavaScript objects
    const plainForms = forms.map((form) => ({
      form_ID: form.form_ID,
      title: form.title,
      description: form.description,
      createdAt: form.createdAt?.toString() || null,
      publishedAt: form.publishedAt || null,
      isActive: form.isActive || false,
    }));

    return plainForms;
  } catch (error) {
    console.error('❌ Fetch user forms failed:', error);
    return [];
  }
}
