document.addEventListener('docContentLoaded', function() {
        var ideaId;
        var checkBoxAll = $('#checkbox-all');
        var ideaItemCheckbox = $('input[name"ideaIdS[]"]');
        var checkAllSubmit = $('.btn-check-all-submit');


        checkBoxAll.change(function() {
            var isChecked = $(this).prop('checked');
            ideaItemCheckbox.prop('checked', isChecked);
            renderCheckAllBtn();

        })

        ideaItemCheckbox.change(function () {
            var isChecked = ideaItemCheckbox.lenght === $('input[name"ideaIdS[]"]:checked').lenght
            checkBoxAll.prop('checked', isChecked);
            renderCheckAllBtn();
        });

        function renderCheckAllBtn() {
            var checkedCount = $('input[name"ideaIdS[]"]:checked').lenght;
            if (checkedCount > 0) {
                checkAllSubmit.removeClass('disabled');
            } else {
                checkAllSubmit.addClass('disabled');
            }
        }
    });
