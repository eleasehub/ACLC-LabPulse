import {
  CreateAssetSchema,
  CreateAssetInput,
  UpdateAssetSchema,
  UpdateAssetInput,
  RelocateAssetSchema,
  RelocateAssetInput,
  QRLookupSchema,
} from '../schemas/asset.schema';

export interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

/**
 * Server Action: Create IT Asset with Hardware Specs
 */
export async function createAssetAction(
  rawInput: unknown
): Promise<ActionResult<{ assetId: string; assetTag: string }>> {
  try {
    const parseResult = CreateAssetSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const flattened = parseResult.error.flatten().fieldErrors;
      return {
        success: false,
        error: 'Validation failed on Asset input fields',
        validationErrors: flattened as Record<string, string[]>,
      };
    }

    const data: CreateAssetInput = parseResult.data;
    const generatedId = `asset-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    // In a live Prisma environment:
    // await prisma.asset.create({ data: { ... } });

    return {
      success: true,
      data: {
        assetId: generatedId,
        assetTag: data.assetTag,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Internal server error while creating IT asset',
    };
  }
}

/**
 * Server Action: Lookup Asset by QR Code / Barcode string
 */
export async function lookupAssetByQRAction(
  scannedTagOrBarcode: string
): Promise<ActionResult<{ found: boolean; asset?: any; searchType: 'TAG' | 'BARCODE' }>> {
  try {
    const validation = QRLookupSchema.safeParse({ scannedTagOrBarcode });
    if (!validation.success) {
      return {
        success: false,
        error: 'Invalid QR tag or barcode input',
      };
    }

    const query = scannedTagOrBarcode.trim();
    const isTag = query.startsWith('ACLC-');

    return {
      success: true,
      data: {
        found: true,
        searchType: isTag ? 'TAG' : 'BARCODE',
        asset: {
          assetTag: isTag ? query : 'ACLC-MNL-LAB1-WS01',
          name: 'Student Workstation 01',
          category: 'WORKSTATION',
          laboratory: 'Lab 1 - Multimedia & Game Dev Lab',
          status: 'OPERATIONAL',
          condition: 'GOOD',
          ipAddress: '192.168.10.15',
          macAddress: '00:1A:2B:3C:4D:5E',
          specs: {
            cpu: 'Intel Core i7-12700',
            ramGb: 16,
            storage: '512GB NVMe SSD',
            gpu: 'NVIDIA GTX 1660 Super 6GB',
          },
        },
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error executing QR lookup',
    };
  }
}

/**
 * Server Action: Relocate Asset across laboratories and update floor map seat
 */
export async function relocateAssetAction(
  rawInput: unknown
): Promise<ActionResult<{ assetId: string; newLocationSummary: string }>> {
  try {
    const parseResult = RelocateAssetSchema.safeParse(rawInput);
    if (!parseResult.success) {
      return {
        success: false,
        error: 'Invalid relocation parameters',
        validationErrors: parseResult.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { assetId, targetLabId, targetGridRow, targetGridCol, transferReason } = parseResult.data;

    return {
      success: true,
      data: {
        assetId,
        newLocationSummary: `Moved to Lab [${targetLabId}] Grid Seat (R${targetGridRow}, C${targetGridCol}). Reason: ${transferReason}`,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Error relocating asset',
    };
  }
}
