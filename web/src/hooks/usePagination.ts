import { useMemo } from "react";

interface UsePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}

function range(start: number, end: number) {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export function usePagination({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}: UsePaginationProps) {
  const paginationRange = useMemo(() => {
    const totalPageCount: number = Math.ceil(totalCount / pageSize);

    // A contagem de páginas é determinada com siblingCount + firstPage + currentPage
    const totalPageNumbers = siblingCount * 2 + 2;

    /*
      Caso 1:
      Se o número de páginas for inferior aos números das páginas que queremos exibir em nosso paginationComponent, retornamos o intervalo [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return ({ 'pages': range(1, totalPageCount) });
    }

    /*
      Calcular o índice irmão à esquerda e à direita e garantir que eles estão dentro do intervalo entre 1 e totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      Não mostramos pontos apenas quando há apenas um número de página a ser inseridos entre os extremos dos irmãos e os limites das páginas, ou seja, 1 e totalPageCount. Assim, estamos usando leftSiblingIndex > 2 e rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount;

    const firstPageIndex = 1;

    /*
      Caso 2: Não há pontos à esquerda para serem exibidos, mas pontos à direita para exibir
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 2 + siblingCount * 2;
      let leftRange = range(1, leftItemCount);

      return ({ 'pages': [...leftRange], 'totalPages': totalPageCount });
    }

    /*
      Caso 3: Não há pontos à direita para serem exibidos, mas pontos à esquerda para exibir
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {

      let rightItemCount = siblingCount * 2;
      let rightRange = range(
        totalPageCount - rightItemCount,
        totalPageCount
      );
      return ({ 'pages': [firstPageIndex, ...rightRange], 'totalPages': totalPageCount });
    }

    /*
      Caso 4: Pontos à esquerda e à direita para exibir
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return ({ 'pages': [firstPageIndex, ...middleRange], 'totalPages': totalPageCount });
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange || { 'pages': [] };
};