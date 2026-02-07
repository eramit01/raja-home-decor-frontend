
export interface ProductSpecProps {
    code?: string;
    height?: number | string;
    width?: number | string;
    capacity?: number | string;
    material?: string;
    finish?: string;
    setIncludes?: string;
    notes?: string;
}

export const ProductSpecifications = ({
    code, height, width, capacity, material, finish, setIncludes, notes
}: ProductSpecProps) => {
    return (
        <div className="bg-white p-4 mb-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Product Specifications</h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                    <tbody>
                        {code && (
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 font-medium text-gray-900 w-1/3">Product Code</th>
                                <td className="px-4 py-3">#{code}</td>
                            </tr>
                        )}
                        {height && (
                            <tr className="border-b">
                                <th className="px-4 py-3 font-medium text-gray-900">Height</th>
                                <td className="px-4 py-3">{height}"</td>
                            </tr>
                        )}
                        {width && (
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 font-medium text-gray-900">Width / Diameter</th>
                                <td className="px-4 py-3">{width}"</td>
                            </tr>
                        )}
                        {capacity && (
                            <tr className="border-b">
                                <th className="px-4 py-3 font-medium text-gray-900">Capacity</th>
                                <td className="px-4 py-3">{capacity} ml</td>
                            </tr>
                        )}
                        {material && (
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 font-medium text-gray-900">Material</th>
                                <td className="px-4 py-3">{material}</td>
                            </tr>
                        )}
                        {finish && (
                            <tr className="border-b">
                                <th className="px-4 py-3 font-medium text-gray-900">Finish</th>
                                <td className="px-4 py-3">{finish}</td>
                            </tr>
                        )}
                        {setIncludes && (
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 font-medium text-gray-900">Set Includes</th>
                                <td className="px-4 py-3">{setIncludes}</td>
                            </tr>
                        )}
                        {notes && (
                            <tr className="border-b">
                                <th className="px-4 py-3 font-medium text-gray-900">Notes</th>
                                <td className="px-4 py-3">{notes}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
