const DRIVE_API = 'https://www.googleapis.com/drive/v3'
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3'
const INDEX_FILENAME = 'duelist-index.json'

export async function loadOrCreateIndex(accessToken) {
  const headers = { Authorization: `Bearer ${accessToken}` }

  // Search for existing index file in App Data folder
  const searchRes = await fetch(
    `${DRIVE_API}/files?spaces=appDataFolder&q=name='${INDEX_FILENAME}'&fields=files(id,name)`,
    { headers }
  )
  const searchData = await searchRes.json()

  // If file exists, read and return it
  if (searchData.files && searchData.files.length > 0) {
    const fileId = searchData.files[0].id
    const fileRes = await fetch(
      `${DRIVE_API}/files/${fileId}?alt=media`,
      { headers }
    )
    const index = await fileRes.json()
    console.log('Loaded existing index from Drive')
    return { index, fileId }
  }

  // File doesn't exist — create a fresh one
  console.log('No index found — creating fresh vault')
  const freshIndex = {
    version: 1,
    user: {
      tier: 'free',
      scansUsed: 0,
      scansResetDate: new Date().toISOString().split('T')[0],
      parryCredits: 0,
      theme: 'warm',
      defaultLeadTimeDays: 30,
    },
    categories: [
      { id: 'cat_001', name: 'vehicle', isSystem: true, recordCount: 0 },
      { id: 'cat_002', name: 'insurance', isSystem: true, recordCount: 0 },
      { id: 'cat_003', name: 'identity', isSystem: true, recordCount: 0 },
      { id: 'cat_004', name: 'pet', isSystem: true, recordCount: 0 },
      { id: 'cat_005', name: 'warranty', isSystem: true, recordCount: 0 },
      { id: 'cat_006', name: 'home', isSystem: true, recordCount: 0 },
    ],
    records: [],
    reminders: [],
    households: [{ id: 'hh_001', name: 'Main', isDefault: true }],
  }

  const fileId = await createIndexFile(freshIndex, accessToken)
  return { index: freshIndex, fileId }
}

export async function saveIndex(index, fileId, accessToken) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }

  await fetch(
    `${UPLOAD_API}/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(index),
    }
  )
  console.log('Index saved to Drive')
}

async function createIndexFile(index, accessToken) {
  // Step 1: Create file metadata
  const metaRes = await fetch(
    `${DRIVE_API}/files`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: INDEX_FILENAME,
        parents: ['appDataFolder'],
      }),
    }
  )
  const meta = await metaRes.json()
  const fileId = meta.id

  // Step 2: Upload the content
  await fetch(
    `${UPLOAD_API}/files/${fileId}?uploadType=media`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(index),
    }
  )

  console.log('Created new index file in Drive:', fileId)
  return fileId
}